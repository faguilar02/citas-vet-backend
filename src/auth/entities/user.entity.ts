import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../models/enums/user-role.enum';
import { Pet } from 'src/pets/entities/pet.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;
  @Column('text', {nullable: true})
  secure_url: string;
  @Column('text', {nullable: true})
  public_id: string;

  @Column('text')
  fullName: string;
  @Column({
    nullable: true,
    length: 9,
  })
  phoneNumber: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column('text', { unique: true })
  email: string;
  @Column('text', { select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column('bool', { default: true })
  isActive: boolean;

  @OneToMany(() => Pet, (p) => p.owner, { cascade: true })
  pet: Pet[];

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.fullName = this.fullName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
