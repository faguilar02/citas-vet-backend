import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/auth/dto';
import { isUUID } from 'class-validator';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet) private readonly petsRepository: Repository<Pet>,
  ) {}
  async create(createPetDto: CreatePetDto, userId: string): Promise<Pet> {
    const { ownerId, ...data } = createPetDto;

    const pet = this.petsRepository.create({
      ownerId: userId,
      ...data,
    });

    try {
      await this.petsRepository.save(pet);

      return pet;
    } catch (error) {
      throw new InternalServerErrorException(
        'algo salió mal, revisar logs del servidor',
      );
    }
  }

  async findAll(userId: string, paginationDto: PaginationDto): Promise<Pet[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const pets = await this.petsRepository.find({
      take: limit,
      skip: offset,
      where: { ownerId: userId },
    });

    if (!pets) throw new NotFoundException('pets have been not found');
    return pets;
  }

  async findOne(id: string, userId: string): Promise<Pet> {
    if (!isUUID(id))
      throw new BadRequestException('id not valid (it must be a UUID)');
    const pet = await this.petsRepository.findOne({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!pet) throw new BadRequestException(`pet was not found`);

    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto, userId: string) {
    const pet = await this.petsRepository.preload({
      id,
      ownerId: userId,
      ...updatePetDto,
    });

    if(!pet) throw new NotFoundException(`pet was not found`)

    await this.petsRepository.save(pet)

    return pet
  }

  async remove(id: string, userId: string) {

    if(!isUUID(id)) throw new BadRequestException('id not valid (it must be UUID)')
    
    const pet = await this.findOne(id, userId)

    if(!pet) throw new NotFoundException('pet was not found')

    this.petsRepository.remove(pet)

    return 'pet was deleted'

  }
}
