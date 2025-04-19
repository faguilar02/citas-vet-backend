import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

enum Species {
  CAT = 'cat',
  DOG = 'dog',
}
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
  species: Species;

  @Column('text')
  race: string;

  @Column('text')
  age: string;

  @Column({ type: 'numeric', precision: 4, scale: 1 })
  weight: number;
}
