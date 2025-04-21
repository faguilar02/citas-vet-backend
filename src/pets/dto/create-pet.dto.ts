import {
  IsEnum,
  IsString,
  MinLength,
  IsNumber,
  Min,
  Max,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Species } from '../models/enums/species.enum';
import { Type } from 'class-transformer';
import { Unit } from '../models/enums/unit.enum';

export class CreatePetDto {
  @IsUUID()
  @IsString()
  @IsOptional()
  ownerId?: string;
  @IsString()
  @MinLength(1)
  name: string;

  @IsEnum(Species)
  specie: Species;

  @IsString()
  @IsOptional()
  @MinLength(1)
  race: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  age: string;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: 'Weight must be a number with up to one decimal place' },
  )
  @Type(() => Number)
  @IsOptional()
  @Min(0.1)
  @Max(99.9)
  weight: number;

  @IsOptional()
  @IsEnum(Unit)
  unit: Unit
}
