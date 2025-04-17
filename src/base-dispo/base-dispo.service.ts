import { CreateBaseDispoDto } from './dto/create-base-dispo.dto';
import { UpdateBaseDispoDto } from './dto/update-base-dispo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDispo } from './entities/base-dispo.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseDispoService {
  constructor(
    @InjectRepository(BaseDispo)
    private readonly baseDispoRepository: Repository<BaseDispo>,
  ) {}
  async create(createBaseDispoDto: CreateBaseDispoDto) {
    try {
      const baseDispo = this.baseDispoRepository.create(createBaseDispoDto);

       await this.baseDispoRepository.save(baseDispo)
    } catch (error) {
      
    }
  }

  findAll() {
    return `This action returns all baseDispo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} baseDispo`;
  }

  update(id: number, updateBaseDispoDto: UpdateBaseDispoDto) {
    return `This action updates a #${id} baseDispo`;
  }

  remove(id: number) {
    return `This action removes a #${id} baseDispo`;
  }
}
