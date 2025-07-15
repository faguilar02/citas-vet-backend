import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistory } from './entities/medical-history.entity';

@Module({
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
  imports: [TypeOrmModule.forFeature([MedicalHistory])],
  exports: [MedicalHistoryService, TypeOrmModule]
})
export class MedicalHistoryModule {}
