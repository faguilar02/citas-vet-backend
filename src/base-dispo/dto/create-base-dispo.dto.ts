import { IsEnum, IsString, Matches } from "class-validator";
import { BaseDispo } from "../entities/base-dispo.entity";

export class CreateBaseDispoDto {

    @IsEnum(BaseDispo)
    @IsString()
    dayOfWeek:string

    @IsString()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    startTime:string

    @IsString()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    endTime:string
}

