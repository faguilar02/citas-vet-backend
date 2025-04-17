import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BaseDispoService } from './base-dispo.service';
import { CreateBaseDispoDto } from './dto/create-base-dispo.dto';
import { UpdateBaseDispoDto } from './dto/update-base-dispo.dto';

@Controller('base-dispo')
export class BaseDispoController {
  constructor(private readonly baseDispoService: BaseDispoService) {}

  @Post()
  create(@Body() createBaseDispoDto: CreateBaseDispoDto) {
    return this.baseDispoService.create(createBaseDispoDto);
  }

  @Get()
  findAll() {
    return this.baseDispoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baseDispoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBaseDispoDto: UpdateBaseDispoDto) {
    return this.baseDispoService.update(+id, updateBaseDispoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.baseDispoService.remove(+id);
  }
}
