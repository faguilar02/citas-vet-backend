import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BaseDispoService } from './base-dispo.service';
import { UpdateBaseDispoDto } from './dto/update-base-dispo.dto';
import { DaysOfWeek } from './models/enums/days-of-week.enum';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/auth/models/enums';

@Controller('base-dispo')
export class BaseDispoController {
  constructor(private readonly baseDispoService: BaseDispoService) {}

  @Get(':vetId')
  findSlotsByVetAndDay(@Param('vetId') vetId: string, @Query('day') day:DaysOfWeek) {
    return this.baseDispoService.findSlotsByVetAndDay(vetId, day);
  }


  @Patch(':id')
  @Auth(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateBaseDispoDto: UpdateBaseDispoDto) {
    return this.baseDispoService.update(+id, updateBaseDispoDto);
  }

  @Delete(':id')
  disableSlot(@Param('id') id: string) {
    return this.baseDispoService.disableSlot(+id);
  }
}
