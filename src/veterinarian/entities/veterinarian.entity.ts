import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VeterinarySpecialty } from '../models/enums/veterinarian-specialty.enum';
import { BaseDispo } from 'src/base-dispo/entities/base-dispo.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Entity({ name: 'veterinarian' })
export class Veterinarian {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: VeterinarySpecialty })
  specialty: VeterinarySpecialty;

  @Column('text', {
    array: true,
    default: [],
  })
  services: string[];

  @Column('text', { nullable: true })
  experienceDescription: string;

  @OneToMany(() => BaseDispo, (baseDispo) => baseDispo.veterinarian, {
    cascade: true,
    eager: true,
  })
  baseDisponibility?: BaseDispo[];

  @Column('text', {nullable: true})
  workPlace: string

  @OneToMany(() => Appointment, (a) => a.veterinarian, {
    cascade: true,
    eager: true,
  })
  appointment: Appointment[];
}
