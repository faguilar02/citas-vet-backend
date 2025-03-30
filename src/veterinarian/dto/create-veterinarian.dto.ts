import { IsEnum, IsString } from "class-validator";
import { CreateUserDto } from "src/auth/dto";
import { VeterinarySpecialty } from "../models/enums/veterinarian-specialty.enum";

export class CreateVeterinarianDto extends CreateUserDto {

    @IsEnum(VeterinarySpecialty)
    @IsString()
    specialty: VeterinarySpecialty
}
