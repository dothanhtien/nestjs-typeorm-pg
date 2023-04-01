import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return { data: users };
  }

  @Post()
  async createUser(@Req() req: Request) {
    const { firstName, lastName, email, password } = req.body;

    const isExist = await this.usersService.checkIfUserExists(email);
    if (isExist) {
      throw new BadRequestException('Email already exists in our system');
    }

    const hashedPassword = this.authService.hashPassword(password);

    const newUser = await this.usersService.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    return { data: newUser };
  }
}
