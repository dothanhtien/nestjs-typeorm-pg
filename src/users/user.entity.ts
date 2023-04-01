import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose({ name: 'firstName', toPlainOnly: true })
  @Column({ nullable: true })
  first_name: string;

  @Expose({ name: 'lastName', toPlainOnly: true })
  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Expose({ name: 'createdAt', toPlainOnly: true })
  @CreateDateColumn()
  created_at: Date;

  @Expose({ name: 'updatedAt', toPlainOnly: true })
  @Column({ type: 'timestamp', nullable: true })
  // use @UpdateDateColumn with default value = null will always generate in a new migration file
  updated_at: Date;
}

export default User;
