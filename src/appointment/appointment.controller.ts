import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { AppointmentState } from './models/enums/appointment-state.enum';



@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Auth()
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto, @GetUser('userId') userId: string) {
    return this.appointmentService.create(createAppointmentDto, userId);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }
  


  @Auth()
  @Get(':id')
  findAppointmentsByPet(@Param('id') petId:string , @Query('state') state?:AppointmentState){
    console.log(state)
    return this.appointmentService.findAppointmentsByPet(petId, state)

  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
