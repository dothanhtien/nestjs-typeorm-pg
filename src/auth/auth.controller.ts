import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import RegisterDTO from './register.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  @HttpCode(201)
  async register(@Body() registerData: RegisterDTO) {
    const isUserExist = await this.usersService.checkIfUserExists(
      registerData.email,
    );
    if (isUserExist) {
      throw new BadRequestException('Email already exists in our system');
    }

    if (
      registerData.password.trim() !== registerData.passwordConfirmation.trim()
    ) {
      throw new BadRequestException('Passwords do not match');
    }
    const hashedPassword = this.authService.hashPassword(registerData.password);

    const newUser = await this.usersService.createUser({
      ...registerData,
      password: hashedPassword,
    });

    return { data: newUser };
  }

  @Post('login')
  @HttpCode(200)
  async logIn(@Req() req: Request) {
    const { email, password } = req.body;

    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Email or password is invalid');
    }

    const isMatch = this.authService.comparePassword(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Email or password is invalid');
    }

    return { data: user };
  }
}
