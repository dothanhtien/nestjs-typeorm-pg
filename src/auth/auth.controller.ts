import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import RegisterDTO from './dtos/register.dto';
import RequestWithUser from './interfaces/request-with-user.interface';
import { plainToClass } from 'class-transformer';
import User from 'src/users/user.entity';
import { Public } from './decorators/public.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(201)
  @Post('/register')
  @Public()
  async register(@Body() registerData: RegisterDTO) {
    const isUserExist = await this.usersService.checkIfUserExistsByEmail(
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

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async logIn(@Req() req: RequestWithUser) {
    const { user } = req;
    const accessToken = this.authService.generateAccessToken(user.id);
    return { data: plainToClass(User, { ...user, accessToken }) };
  }

  @Get('/profile')
  getProfile(@Request() req: RequestWithUser) {
    return { data: req.user };
  }
}
