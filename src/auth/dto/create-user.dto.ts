import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../models/enums';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:^(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$)/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^9\d{8}$/, {
    message: 'Phone number must start with 9 and have exactly 9 digits',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'Address must be less than 3 characters',
  })
  address?: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsEnum(UserRole)
  @IsString()
  @IsOptional()
  role?: UserRole;
}
