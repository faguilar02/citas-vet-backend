import { IsEnum, IsOptional, IsString, IsUUID, Matches } from "class-validator";
import { BaseDispo } from "../entities/base-dispo.entity";
import { DaysOfWeek } from "../models/enums/days-of-week.enum";

export class CreateBaseDispoDto {

    @IsUUID()
    @IsOptional()
    veterinarianId: string

    @IsEnum(BaseDispo)
    @IsString()
    dayOfWeek:DaysOfWeek

    @IsString()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    startTime:string

    @IsString()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    endTime:string
}

