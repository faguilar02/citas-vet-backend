import { Module } from '@nestjs/common';
import { AppointmentDetailsService } from './appointment-details.service';
import { AppointmentDetailsController } from './appointment-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentDetail } from './entities/appointment-detail.entity';

@Module({
  controllers: [AppointmentDetailsController],
  providers: [AppointmentDetailsService],
  imports: [TypeOrmModule.forFeature([AppointmentDetail])]
})
export class AppointmentDetailsModule {}
