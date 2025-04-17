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
import { DataSource, Repository } from 'typeorm';
import { UserRole } from 'src/auth/models/enums';
import { PaginationDto } from 'src/auth/dto/pagination.dto';
import { BaseDispoService } from 'src/base-dispo/base-dispo.service';
import { BaseDispo } from 'src/base-dispo/entities/base-dispo.entity';

@Injectable()
export class VeterinarianService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    @InjectRepository(BaseDispo)
    private readonly baseDispoRepository: Repository<BaseDispo>,
    @InjectRepository(Veterinarian)
    private readonly veterinarianRepository: Repository<Veterinarian>,
  ) {}

  async create(createVeterinarianDto: CreateVeterinarianDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { specialty, baseDisponibility, ...userData } =
        createVeterinarianDto;

      const veterinarian = this.veterinarianRepository.create({
        specialty,
        user: await this.authService.register(userData, queryRunner.manager),
      });

      veterinarian.user.role = UserRole.VETERINARIAN;

      await queryRunner.manager.save(veterinarian);

      if (baseDisponibility && baseDisponibility.length > 0) {
        const baseDisponibiltyEntities = this.baseDispoRepository.create(
          baseDisponibility.map((item) => ({
            veterinarianId: veterinarian.id,
            ...item,
          })),
        );

        await queryRunner.manager.save(baseDisponibiltyEntities);
      }

      await queryRunner.commitTransaction();
      const savedVeterinarian = await this.veterinarianRepository.findOne({
        where: { id: veterinarian.id },
        relations: {
          baseDisponibility: true,
          user: true,
        },
      });

      delete savedVeterinarian.user.userId;
      savedVeterinarian.baseDisponibility.forEach(
        (item) => delete item.veterinarianId,
      );
      return savedVeterinarian;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBErrors(error);
    } finally {
      await queryRunner.release();
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
