import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'medical-history'})
export class MedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Appointment, (a) => a.medicalHistory, {
    cascade: true,
    eager: true,
  })
  appointment: Appointment[];
}
