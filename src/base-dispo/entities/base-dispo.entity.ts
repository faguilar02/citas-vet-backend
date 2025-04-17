import { Veterinarian } from "src/veterinarian/entities/veterinarian.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DaysOfWeek } from "../models/enums/days-of-week.enum";

@Entity({name:'base-disponibility'})
export class BaseDispo {

    @PrimaryGeneratedColumn()
    id: number

    @Column('uuid')
    veterinarianId: string
    
    @ManyToOne(() => Veterinarian, v => v.baseDisponibility, {onDelete: 'CASCADE'} )
    @JoinColumn({ name: 'veterinarianId' , referencedColumnName: 'id'})
    veterinarian: Veterinarian

    @Column({type: 'enum', enum: DaysOfWeek })
    dayOfWeek: DaysOfWeek

    @Column({type: 'time'})
    startTime:string

    @Column({type: 'time'})
    endTime: string




}
