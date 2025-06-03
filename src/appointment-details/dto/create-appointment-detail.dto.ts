import { IsNotEmpty, IsOptional, IsPostalCode, IsString, IsUUID, MinLength } from "class-validator";

export class CreateAppointmentDetailDto {

    @IsUUID()
    @IsNotEmpty()
    appointmentId: string

    @IsString()
    @MinLength(3)
    diagnosis: string

    @IsOptional()
    @IsString()
    @MinLength(3)
    treatment: string

    @IsOptional()
    @IsString()
    @MinLength(3)
    notes: string
}
