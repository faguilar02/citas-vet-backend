import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
import { AppointmentState } from '../models/enums/appointment-state.enum';

export class CreateAppointmentDto {
  @IsUUID()
  petId: string;

  @IsUUID()
  veterinarianId: string;

  // @IsUUID()
  // medicalHistoryId: string;

  @IsDateString()
  date: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @IsString()
  @MinLength(3)
  service: string;

  @IsEnum(AppointmentState)
  @IsOptional()
  state: AppointmentState;
}
