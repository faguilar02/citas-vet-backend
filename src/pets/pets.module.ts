import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pet]), AuthModule, CloudinaryModule], // este auth module es para poner los decoradores en el controller
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService, TypeOrmModule]
})
export class PetsModule {}
