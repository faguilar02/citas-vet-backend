import { text } from 'stream/consumers';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AppointmentState } from '../models/enums/appointment-state.enum';
import { MedicalHistory } from 'src/medical-history/entities/medical-history.entity';
import { Pet } from 'src/pets/entities/pet.entity';

@Entity({ name: 'appointment' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'text' })
  service: string;

  @Column({
    type: 'enum',
    enum: AppointmentState,
    default: AppointmentState.CONFIRMED,
  })
  state: AppointmentState;

  @Column('uuid')
  medicalHistoryId: string;
  @Column('uuid')
  petId:string

  @ManyToOne(() => MedicalHistory, (mh) => mh.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medicalHistoryId', referencedColumnName: 'id' })
  medicalHistory: MedicalHistory;

  @ManyToOne( () => Pet, p => p.id, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'petId', referencedColumnName: 'id' })
  pet: Pet
}
