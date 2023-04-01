import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
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
