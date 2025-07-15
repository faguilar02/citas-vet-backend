import { Module } from '@nestjs/common';
import { VeterinarianService } from './veterinarian.service';
import { VeterinarianController } from './veterinarian.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veterinarian } from './entities/veterinarian.entity';

import { BaseDispoModule } from 'src/base-dispo/base-dispo.module';

@Module({
  imports: [AuthModule, BaseDispoModule, TypeOrmModule.forFeature([Veterinarian])],
  controllers: [VeterinarianController],
  providers: [VeterinarianService],
  exports: [VeterinarianService, TypeOrmModule]
})
export class VeterinarianModule {}
