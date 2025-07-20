import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAppointmentDetailDto } from './dto/create-appointment-detail.dto';
import { UpdateAppointmentDetailDto } from './dto/update-appointment-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentDetail } from './entities/appointment-detail.entity';
import { Repository } from 'typeorm';
import { AppointmentService } from 'src/appointment/appointment.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class AppointmentDetailsService {
  constructor(
    @InjectRepository(AppointmentDetail)
    private readonly appointmentDetailsRepository: Repository<AppointmentDetail>,

    private readonly appointmentService: AppointmentService,
  ) {}

  async create(
    createAppointmentDetailDto: CreateAppointmentDetailDto,
    userId: string,
  ) {
    const { appointmentId } = createAppointmentDetailDto;

    const appointment = await this.appointmentService.findOne(appointmentId);

    if (!appointment) throw new NotFoundException('appointment not found');

    if (appointment.veterinarianId !== userId)
      throw new UnauthorizedException(
        'access denied, you can´t add details to this appoinment',
      );

    const appointmentDetails = this.appointmentDetailsRepository.create(
      createAppointmentDetailDto,
    );

    await this.appointmentDetailsRepository.save(appointmentDetails);

    return appointmentDetails;
  }

  async getDetailsByAppoinment(appointmentId:string) {
    const appointmentDetails = await this.appointmentDetailsRepository.findOne({
      where: {appointmentId}
    })

    if(!appointmentDetails) throw new NotFoundException('no details found for this appoinment')

    return appointmentDetails
  }

  findOne(id: number) {
    return `This action returns a #${id} appointmentDetail`;
  }

  update(id: number, updateAppointmentDetailDto: UpdateAppointmentDetailDto) {
    return `This action updates a #${id} appointmentDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointmentDetail`;
  }
}
