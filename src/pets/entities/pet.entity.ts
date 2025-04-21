import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Species } from '../models/enums/species.enum';
import { Unit } from '../models/enums/unit.enum';

@Entity({ name: 'pets' })
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => User, (u) => u.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'userId' })
  owner: User;

  @Column('text')
  name: string;

  @Column({ type: 'enum', enum: Species })
  specie: Species;

  @Column({ type: 'text', nullable: true })
  race: string;

  @Column({ type: 'text', nullable: true })
  age: string;

  @Column({ type: 'numeric', precision: 4, scale: 1, nullable: true })
  weight: number;

  @Column({type: 'enum', enum: Unit, nullable: true})
  unit: Unit

}
