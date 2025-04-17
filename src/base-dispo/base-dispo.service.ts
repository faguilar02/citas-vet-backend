import { Injectable } from '@nestjs/common';
import { CreateBaseDispoDto } from './dto/create-base-dispo.dto';
import { UpdateBaseDispoDto } from './dto/update-base-dispo.dto';

@Injectable()
export class BaseDispoService {
  create(createBaseDispoDto: CreateBaseDispoDto) {
    return 'This action adds a new baseDispo';
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
