import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import CreateUserDTO from './dto/create-user.dto';
import UpdateUserDTO from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  async createUser(createUserData: CreateUserDTO) {
    const newUser = this.usersRepository.create(createUserData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateUser(id: string, updateUserData: UpdateUserDTO) {
    // const user = await this.usersRepository.update(id, { ...updateUserData });
    // return user;

    const user = await this.usersRepository.findOneBy({ id });
    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateUserData,
    });
    return updatedUser;
  }

  async deleteUserById(id: string) {
    const result = await this.usersRepository.delete({ id });
    return result.affected > 0;
  }

  async checkIfUserExistsById(id: string): Promise<boolean> {
    const count = await this.usersRepository.countBy({ id });
    return count > 0;
  }

  async checkIfUserExistsByEmail(email: string): Promise<boolean> {
    const count = await this.usersRepository.countBy({ email });
    return count > 0;
  }
}
