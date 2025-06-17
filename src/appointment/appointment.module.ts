import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { MedicalHistory } from 'src/medical-history/entities/medical-history.entity';
import { MedicalHistoryService } from 'src/medical-history/medical-history.service';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, MedicalHistoryService],
  imports: [TypeOrmModule.forFeature([Appointment, MedicalHistory])]
})
export class AppointmentModule {}
