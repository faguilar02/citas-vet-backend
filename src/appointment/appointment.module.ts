import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { MedicalHistoryModule } from '../medical-history/medical-history.module';
import { VeterinarianModule } from '../veterinarian/veterinarian.module';
import { PetsModule } from 'src/pets/pets.module';
import { AuthModule } from '../auth/auth.module';
import { BaseDispoModule } from 'src/base-dispo/base-dispo.module';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [
    AuthModule,
    MedicalHistoryModule,
    VeterinarianModule,
    PetsModule,
    BaseDispoModule,
    TypeOrmModule.forFeature([Appointment]),
  ],

  exports: [AppointmentService, TypeOrmModule]
})
export class AppointmentModule {}
