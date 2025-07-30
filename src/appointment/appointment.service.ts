import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalHistoryService } from 'src/medical-history/medical-history.service';
import { VeterinarianService } from 'src/veterinarian/veterinarian.service';
import { PetsService } from 'src/pets/pets.service';
import { BaseDispoService } from 'src/base-dispo/base-dispo.service';
import { DaysOfWeek } from 'src/base-dispo/models/enums/days-of-week.enum';
import { AppointmentState } from './models/enums/appointment-state.enum';
import { query } from 'express';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly medicalHistoryService: MedicalHistoryService,
    private readonly veterinarianService: VeterinarianService,
    private readonly petService: PetsService,
    private readonly baseDispoService: BaseDispoService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    // query builder que reciba el createAppointmentDto

    console.log('datos recibidos para crear cita:', createAppointmentDto);
    console.log({ userId });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { petId, veterinarianId, ...appointmentData } =
        createAppointmentDto;

      // verificar que exista el veterinario con ese id
      const veterinarian = await this.veterinarianService.findOne(
        veterinarianId,
        queryRunner.manager,
      );

      // verificar que exista la mascota y el dueño sea el correcto
      const pet = await this.petService.findOneByIdAndOwner(
        petId,
        userId,
        queryRunner.manager,
      );

      // verificar que la fecha de la cita no sea pasada
      const currentDate = new Date();
      const { date, startTime } = appointmentData;
      const appointmentDate = new Date(`${date}T${startTime}`);
      if (appointmentDate < currentDate)
        throw new BadRequestException(
          'cannot create an appointment in the past',
        );

      // verificar que el veterinario tenga disponibilidad esa fecha

      const dateBD = new Date(date);
      const dayOfWeek = dateBD.getDay() + 1;

      const days = [
        'Sunday' as DaysOfWeek,
        DaysOfWeek.MONDAY,
        DaysOfWeek.TUESDAY,
        DaysOfWeek.WEDNESDAY,
        DaysOfWeek.THURSDAY,
        DaysOfWeek.FRIDAY,
        DaysOfWeek.SATURDAY,
      ];

      const availableSlots = await this.baseDispoService.findSlotsByVetAndDay(
        veterinarianId,
        days[dayOfWeek],
        queryRunner.manager,
      );

      const isSlotAvailable = availableSlots.includes(startTime);
      if (!isSlotAvailable)
        throw new BadRequestException(
          'start time selected is not available to this vet',
        );

      const appointmentVet = await this.findAppointmentByVet(
        veterinarianId,
        startTime,
        date,
        queryRunner.manager,
      );

      const appointmentPet = await this.findAppointmentByPet(
        petId,
        startTime,
        date,
        queryRunner.manager,
      );

      if (appointmentVet) {
        throw new BadRequestException(
          'appointment already exists for this date and hour (vet)',
        );
      }

      if (appointmentPet) {
        throw new BadRequestException(
          'appointment already exists for this date and hour (pet)',
        );
      }

      const appointment = this.appointmentRepository.create({
        petId,
        // medicalHistoryId: medicalHistory.id,
        veterinarianId,
        state: AppointmentState.CONFIRMED,
        ...appointmentData,
      });

      await queryRunner.manager.save(appointment);
      await queryRunner.commitTransaction();

      return appointment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateAppointment(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const appointment = await this.findOne(id, queryRunner.manager);

      if (!appointment) {
        throw new NotFoundException('appointment not found');
      }

      let medicalHistory = await this.medicalHistoryService.findOneByPetId(
        appointment.petId,
        queryRunner.manager,
      );

      const { state } = updateAppointmentDto;

      if (!medicalHistory && state === AppointmentState.COMPLETED) {
        medicalHistory = await this.medicalHistoryService.create(
          { petId: appointment.petId },
          queryRunner.manager,
        );
      }

      const updateData: any = {
        id,
        ...updateAppointmentDto,
      };

      if (medicalHistory) {
        updateData.medicalHistoryId = medicalHistory.id;
      }

      const appointmentFromBD = await this.appointmentRepository.preload(
        updateData,
      );
      await queryRunner.manager.save(appointmentFromBD);

      await queryRunner.commitTransaction();
      return appointmentFromBD;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAppointmentByVet(
    veterinarianId: string,
    startTime: string,
    date: string,
    manager: EntityManager,
  ) {
    // Usar query builder para comparación más precisa de fechas
    const appointmentVetDB = await manager
      .createQueryBuilder(Appointment, 'appointment')
      .where('appointment.veterinarianId = :veterinarianId', { veterinarianId })
      .andWhere('appointment.startTime = :startTime', { startTime })
      .andWhere('DATE(appointment.date) = DATE(:date)', { date })
      .getOne();

    return appointmentVetDB;
  }

  async findAppointmentByPet(
    petId: string,
    startTime: string,
    date: string,
    manager: EntityManager,
  ) {
    // Usar query builder para comparación más precisa de fechas
    const appointmentPetDB = await manager
      .createQueryBuilder(Appointment, 'appointment')
      .where('appointment.petId = :petId', { petId })
      .andWhere('appointment.startTime = :startTime', { startTime })
      .andWhere('DATE(appointment.date) = DATE(:date)', { date })
      .getOne();

    return appointmentPetDB;
  }

  findAll() {
    return `This action returns all appointment`;
  }

  async findAppointmentsByPet(
    petId: string,
    userId: string,
    state?: AppointmentState,
  ) {
    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.pet', 'pet')
      .where('appointment.petId = :petId', { petId })
      .andWhere('pet.ownerId = :userId', { userId }); // Verificar ownership

    if (state) {
      queryBuilder.andWhere('appointment.state = :state', { state });
    }

    const appointments = await queryBuilder.getMany();

    if (appointments.length === 0) {
      throw new NotFoundException('No appointments found');
    }

    return appointments.map((a) => {
      delete a.pet.appointment;
      return a;
    });
  }

  async findAppointmentsByOwnerId(
    userId: string,
    state?: string,
    last?: number,
  ) {
    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.pet', 'pet')
      .where('pet.ownerId = :userId', { userId });

    if (state) {
      queryBuilder.andWhere('appointmnet.state = :state', { state });
    }

    const appointments = await queryBuilder.getMany();

    if (appointments.length === 0)
      throw new NotFoundException('No appointments found');

    if (last) return appointments.slice(-last).reverse();

    return appointments;
  }

  async findOne(id: string, manager?: EntityManager) {
    let appointment: Appointment;

    if (manager) {
      appointment = await manager.findOne(Appointment, { where: { id } });
    } else {
      appointment = await this.appointmentRepository.findOneBy({ id });
    }

    if (!appointment) throw new NotFoundException('appointment not found');

    return appointment;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
