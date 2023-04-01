import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import CreateUserDTO from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async createUser(createUserData: CreateUserDTO) {
    const newUser = this.usersRepository.create(createUserData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async checkIfUserExists(email: string): Promise<boolean> {
    const count = await this.usersRepository.countBy({ email });
    return count > 0;
  }
}
