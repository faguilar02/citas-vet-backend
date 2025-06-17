import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DataSource, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalHistory } from 'src/medical-history/entities/medical-history.entity';
import { MedicalHistoryService } from 'src/medical-history/medical-history.service';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly medicalHistoryService: MedicalHistoryService,
  ) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    // query builder que reciba el createAppointmentDto

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      const { petId, ...appointmentData } = createAppointmentDto;

      let medicalHistory = await this.medicalHistoryService.findOneByPetId(
        petId,
      );

      if (!medicalHistory){
          medicalHistory = await this.medicalHistoryService.create({ petId });
      }

      const appointment = this.appointmentRepository.create({
        petId, 
        medicalHistoryId: medicalHistory.id,
        ...appointmentData
      })

      await queryRunner.manager.save(appointment)
      await queryRunner.commitTransaction()

      return appointment
      
    } catch(error){
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }
  }

  findAll() {
    return `This action returns all appointment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
