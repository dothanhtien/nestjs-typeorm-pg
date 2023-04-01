import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @Expose({ name: 'firstName' })
  first_name: string;

  @Column({ nullable: true })
  @Expose({ name: 'lastName' })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  // use @UpdateDateColumn with default value = null will always generate in a new migration file
  @Expose({ name: 'updatedAt' })
  updated_at: Date;
}

export default User;
