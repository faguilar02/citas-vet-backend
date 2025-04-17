import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "src/auth/dto";
import { VeterinarySpecialty } from "../models/enums/veterinarian-specialty.enum";
import { CreateBaseDispoDto } from "src/base-dispo/dto/create-base-dispo.dto";

export class CreateVeterinarianDto extends CreateUserDto {

    @IsEnum(VeterinarySpecialty)
    @IsString()
    specialty: VeterinarySpecialty

    @IsNotEmpty()
    @IsArray()
    @IsOptional()
    baseDisponibility: CreateBaseDispoDto[]
}
