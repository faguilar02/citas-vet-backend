import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { VeterinarySpecialty } from '../models/enums/veterinarian-specialty.enum';
import { BaseDispo } from 'src/base-dispo/entities/base-dispo.entity';

@Entity({ name: 'veterinarian' })
export class Veterinarian {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' , referencedColumnName: 'userId'})
  user: User;

  @Column({ type: 'enum', enum: VeterinarySpecialty })
  specialty: VeterinarySpecialty;

  @OneToMany( () => BaseDispo, (baseDispo) => baseDispo.veterinarian, {
    cascade: true, eager: true
  })
  baseDisponibility?: BaseDispo[]

}

