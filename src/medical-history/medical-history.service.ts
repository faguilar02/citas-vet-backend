import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalHistory } from './entities/medical-history.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
  ) {}
  async create(
    createMedicalHistoryDto: CreateMedicalHistoryDto,
    manager?: EntityManager,
  ) {
    const medicalHistory = this.medicalHistoryRepository.create(
      createMedicalHistoryDto,
    );

    if (manager) {
      await manager.save(medicalHistory);
    } else {
      await this.medicalHistoryRepository.save(medicalHistory);
    }

    return medicalHistory;
  }

  findAll() {
    return `This action returns all medicalHistory`;
  }

  async findOneByPetId(id: string, manager?: EntityManager) {
    if (!isUUID(id))
      throw new BadRequestException('id not valid (it must be a UUID)');

    let medicalHistory:MedicalHistory;

    if (manager) {
      medicalHistory = await manager.findOne(MedicalHistory, {
        where: { petId: id },
      });
    } else {
      medicalHistory = await this.medicalHistoryRepository.findOneBy({
        petId: id,
      });
    }

    if (!medicalHistory) return null

    return medicalHistory;
  }

  update(id: number, updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    return `This action updates a #${id} medicalHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalHistory`;
  }
}
