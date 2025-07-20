import { Module } from '@nestjs/common';
import { AppointmentDetailsService } from './appointment-details.service';
import { AppointmentDetailsController } from './appointment-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentDetail } from './entities/appointment-detail.entity';
import { AppointmentModule } from '../appointment/appointment.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AppointmentDetailsController],
  providers: [AppointmentDetailsService],
  imports: [AuthModule, AppointmentModule, TypeOrmModule.forFeature([AppointmentDetail])]
})
export class AppointmentDetailsModule {}
