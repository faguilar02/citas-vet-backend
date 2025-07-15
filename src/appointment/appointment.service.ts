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
      const dayOfWeek = dateBD.getDay();

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

      let medicalHistory = await this.medicalHistoryService.findOneByPetId(
        petId,
        queryRunner.manager,
      );

      if (!medicalHistory) {
        medicalHistory = await this.medicalHistoryService.create(
          { petId },
          queryRunner.manager,
        );
      }

      const appointment = this.appointmentRepository.create({
        petId,
        medicalHistoryId: medicalHistory.id,
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

  findAll() {
    return `This action returns all appointment`;
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

  findOne(id: string) {}

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
