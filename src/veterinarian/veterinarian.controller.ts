import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VeterinarianService } from './veterinarian.service';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { UpdateVeterinarianDto } from './dto/update-veterinarian.dto';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/auth/models/enums';
import { PaginationDto } from 'src/auth/dto/pagination.dto';

@Controller('veterinarian')
export class VeterinarianController {
  constructor(private readonly veterinarianService: VeterinarianService) {}

  @Auth(UserRole.ADMIN)
  @Post()
  create(@Body() createVeterinarianDto: CreateVeterinarianDto) {
    return this.veterinarianService.create(createVeterinarianDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.veterinarianService.findOne(id);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.veterinarianService.findAll(paginationDto);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateVeterinarianDto: UpdateVeterinarianDto,
  ) {
    return this.veterinarianService.update(+id, updateVeterinarianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veterinarianService.remove(+id);
  }
}
