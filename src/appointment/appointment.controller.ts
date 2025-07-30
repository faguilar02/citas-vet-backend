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
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser('userId') userId: string,
  ) {
    return this.appointmentService.create(createAppointmentDto, userId);
  }

  @Auth()
  @Get()
  findAll(@GetUser('userId') userId: string, @Query('state') state?: string, @Query('last') last?: string) {
    return this.appointmentService.findAppointmentsByOwnerId(userId, state, +last);
  }

  @Auth()
  @Get('pet/:id')
  findAppointmentsByPet(
    @Param('id') petId: string,
    @GetUser('userId') userId: string,
    @Query('state') state?: AppointmentState,
  ) {
    console.log(state);
    return this.appointmentService.findAppointmentsByPet(petId, userId, state);
  }

  @Patch(':id')
  updateAppointment(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto
  ) {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Get(':id')
  findAppointmentById(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  // update(
  //   @Param('id') id: string,
  //   @Body() updateAppointmentDto: UpdateAppointmentDto,
  // ) {
  //   return this.appointmentService.update(+id, updateAppointmentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
