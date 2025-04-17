import { Veterinarian } from "src/veterinarian/entities/veterinarian.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { DaysOfWeek } from "../models/enums/days-of-week.enum";

@Entity({name:'base-disponibility'})
export class BaseDispo {

    @PrimaryColumn('uuid')
    id: string

    @ManyToOne(() => Veterinarian, (veterinarian) => veterinarian.baseDisponibility, {
        onDelete: 'CASCADE'
    })
    veterinarian: Veterinarian

    @Column({type: 'enum', enum: DaysOfWeek })
    dayOfWeek: DaysOfWeek

    @Column({type: 'time'})
    startTime:string

    @Column({type: 'time'})
    endTime: string




}
