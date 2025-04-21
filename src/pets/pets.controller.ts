import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/auth/dto';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Auth()
  @Post()
  create(@Body() createPetDto: CreatePetDto, @GetUser('userId') userId: string) {
    
    return this.petsService.create(createPetDto , userId);
  }

  @Auth()
  @Get()
  findAll(@GetUser('userId') userId: string, @Query() paginationDto:PaginationDto) {
    return this.petsService.findAll(userId, paginationDto);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string , @GetUser('userId') userId: string) {
    return this.petsService.findOne(id, userId);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto , @GetUser('userId') userId: string) {
    return this.petsService.update(id, updatePetDto, userId);
  }
  
  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.petsService.remove(id, userId);
  }
}
