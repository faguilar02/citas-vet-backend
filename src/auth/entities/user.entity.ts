import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../models/enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  name: string;
  @Column('text', { unique: true })
  email: string;
  @Column('text')
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column('bool' , {default: true})
  isActive: boolean;
}
