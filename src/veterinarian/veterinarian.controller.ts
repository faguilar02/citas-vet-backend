import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeterinarianService } from './veterinarian.service';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { UpdateVeterinarianDto } from './dto/update-veterinarian.dto';

@Controller('veterinarian')
export class VeterinarianController {
  constructor(private readonly veterinarianService: VeterinarianService) {}

  @Post()
  create(@Body() createVeterinarianDto: CreateVeterinarianDto) {
    return this.veterinarianService.create(createVeterinarianDto);
  }

  @Get()
  findAll() {
    return this.veterinarianService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.veterinarianService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVeterinarianDto: UpdateVeterinarianDto) {
    return this.veterinarianService.update(+id, updateVeterinarianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veterinarianService.remove(+id);
  }
}
