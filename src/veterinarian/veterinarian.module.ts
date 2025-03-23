import { Module } from '@nestjs/common';
import { VeterinarianService } from './veterinarian.service';
import { VeterinarianController } from './veterinarian.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veterinarian } from './entities/veterinarian.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Veterinarian])],
  controllers: [VeterinarianController],
  providers: [VeterinarianService, AuthService],
})
export class VeterinarianModule {}
