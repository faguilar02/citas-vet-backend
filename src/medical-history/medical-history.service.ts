import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalHistory } from './entities/medical-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
  ) {}
  async create(createMedicalHistoryDto: CreateMedicalHistoryDto) {
    
    const medicalHistory = this.medicalHistoryRepository.create(createMedicalHistoryDto)

    await this.medicalHistoryRepository.save(medicalHistory)

    return medicalHistory
  }

  findAll() {
    return `This action returns all medicalHistory`;
  }

  async findOneByPetId(id: string) {
    if (!isUUID(id))
      throw new BadRequestException('id not valid (it must be a UUID)');

    const medicalHistory = await this.medicalHistoryRepository.findOneBy({
      petId: id,
    });

    if (!medicalHistory) throw new BadRequestException('user not found');

    return medicalHistory;
  }

  update(id: number, updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    return `This action updates a #${id} medicalHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalHistory`;
  }
}
