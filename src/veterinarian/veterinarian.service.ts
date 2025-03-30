import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { UpdateVeterinarianDto } from './dto/update-veterinarian.dto';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Veterinarian } from './entities/veterinarian.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/auth/models/enums';
import { PaginationDto } from 'src/auth/dto/pagination.dto';

@Injectable()
export class VeterinarianService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Veterinarian)
    private readonly veterinarianRepository: Repository<Veterinarian>,
  ) {}

  async create(createVeterinarianDto: CreateVeterinarianDto) {
    try {
      const { specialty, ...user } = createVeterinarianDto;

      const veterinarian = this.veterinarianRepository.create({
        specialty,
        user: await this.authService.register(user),
      });

      veterinarian.user.role = UserRole.VETERINARIAN;

      await this.veterinarianRepository.save(veterinarian);

      return veterinarian;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const veterinarians = await this.veterinarianRepository.find({
      take: limit,
      skip: offset,
      relations: {
        user: true,
      },
    });

    veterinarians.forEach(({ user }) => delete user.userId);

    return veterinarians;
  }

  findOne(id: number) {
    return `This action returns a #${id} veterinarian`;
  }

  update(id: number, updateVeterinarianDto: UpdateVeterinarianDto) {
    return `This action updates a #${id} veterinarian`;
  }

  remove(id: number) {
    return `This action removes a #${id} veterinarian`;
  }
}
