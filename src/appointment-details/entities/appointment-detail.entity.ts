import { Appointment } from 'src/appointment/entities/appointment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'appointment-detail' })
export class AppointmentDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appointmentId: string;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text' })
  treatment: string;

  @Column({ type: 'text'})
  notes: string;

  @OneToOne(() => Appointment, { cascade: true})
  @JoinColumn({ name: 'appointmentId', referencedColumnName: 'id' })
  appointment: Appointment;
}
