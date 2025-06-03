import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateMedicalHistoryDto {

    @IsUUID()
    @IsNotEmpty()
    petId: string
}
