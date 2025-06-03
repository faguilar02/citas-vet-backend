import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'medical-history'})
export class MedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Appointment, (a) => a.medicalHistory, {
    cascade: true,
    eager: true,
  })
  appointment: Appointment[];

  @Column('uuid')
  petId: string

  @OneToOne( () => Pet, {cascade: true, eager: true})
  @JoinColumn({name: 'petId', referencedColumnName: 'id'})
  pet:Pet
}
