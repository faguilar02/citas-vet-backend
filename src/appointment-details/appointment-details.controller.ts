import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentDetailsService } from './appointment-details.service';
import { CreateAppointmentDetailDto } from './dto/create-appointment-detail.dto';
import { UpdateAppointmentDetailDto } from './dto/update-appointment-detail.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { UserRole } from 'src/auth/models/enums';

@Controller('appointment-details')
export class AppointmentDetailsController {
  constructor(private readonly appointmentDetailsService: AppointmentDetailsService) {}

  @Auth(UserRole.VETERINARIAN)
  @Post()
  create(@Body() createAppointmentDetailDto: CreateAppointmentDetailDto, @GetUser('userId') userId:string) {
    return this.appointmentDetailsService.create(createAppointmentDetailDto, userId);
  }

  // @Get()
  // findAll() {
  //   return this.appointmentDetailsService.findAll();
  // }

  @Get('appointment/:id')
  findOne(@Param('id') id: string) {
    return this.appointmentDetailsService.getDetailsByAppoinment(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDetailDto: UpdateAppointmentDetailDto) {
    return this.appointmentDetailsService.update(+id, updateAppointmentDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentDetailsService.remove(+id);
  }
}
