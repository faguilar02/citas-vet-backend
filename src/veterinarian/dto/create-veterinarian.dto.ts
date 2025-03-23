import { IsEnum, IsString } from "class-validator";
import { VeterinarySpecialty } from "../models/enums/veterinary-specialty.enum";
import { CreateUserDto } from "src/auth/dto";

export class CreateVeterinarianDto extends CreateUserDto {

    @IsEnum(VeterinarySpecialty)
    @IsString()
    specialty: VeterinarySpecialty
}
