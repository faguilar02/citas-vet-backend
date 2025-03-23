import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { VeterinarySpecialty } from '../models/enums/veterinary-specialty.enum';

@Entity({ name: 'veterinarian' })
export class Veterinarian {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' , referencedColumnName: 'userId'})
  user: User;

  @Column({ type: 'enum', enum: VeterinarySpecialty })
  specialty: VeterinarySpecialty;
}
