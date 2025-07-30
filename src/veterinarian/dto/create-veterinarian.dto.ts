import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateUserDto } from 'src/auth/dto';
import { VeterinarySpecialty } from '../models/enums/veterinarian-specialty.enum';
import { CreateBaseDispoDto } from 'src/base-dispo/dto/create-base-dispo.dto';

export class CreateVeterinarianDto extends CreateUserDto {
  @IsEnum(VeterinarySpecialty)
  @IsString()
  specialty: VeterinarySpecialty;

  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    if (Array.isArray(value)) return value;
    return [value];
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  services?: string[];

  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    if (Array.isArray(value)) return value;
    return [];
  })
  @Type(() => CreateBaseDispoDto)
  @IsArray()
  @IsOptional()
  baseDisponibility?: CreateBaseDispoDto[];

  @IsString()
  @IsOptional()
  experienceDescription?: string;

  @IsString()
  @IsOptional()
  workPlace?: string;
}