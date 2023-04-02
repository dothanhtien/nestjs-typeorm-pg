import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { TrimBodyValuesPipe } from 'src/pipes/trim-body-values.pipe';
import CreateUserDTO from './dto/create-user.dto';
import UpdateUserDTO from './dto/update-user.dto';
import User from './user.entity';
import { UsersService } from './users.service';
import PaginationParams from 'src/utils/types/pagination-params.type';
import PaginationResponse from 'src/utils/interfaces/pagination-response';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  async getUsers(
    @Query() { page, limit }: PaginationParams,
  ): Promise<{ data: User[]; pagination: PaginationResponse }> {
    const { data, pagination } = await this.usersService.getUsers(page, limit);
    return { data, pagination };
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User does not exist in our system');
    }

    return user;
  }

  @Post()
  async createUser(@Body() createUserData: CreateUserDTO): Promise<User> {
    const isExist = await this.usersService.checkIfUserExistsByEmail(
      createUserData.email,
    );
    if (isExist) {
      throw new BadRequestException('Email already exists in our system');
    }

    if (
      createUserData.password.trim() !==
      createUserData.passwordConfirmation.trim()
    ) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = this.authService.hashPassword(
      createUserData.password,
    );

    const newUser = await this.usersService.createUser({
      ...createUserData,
      password: hashedPassword,
    });

    return newUser;
  }

  @Patch(':id')
  async updateUser(
    @Param() { id }: { id: string },
    @Body(new TrimBodyValuesPipe()) updateUserData: UpdateUserDTO,
  ) {
    console.log({ updateUserData });

    if (
      updateUserData.newPassword &&
      updateUserData.newPassword.trim() !==
        updateUserData.newPasswordVerification.trim()
    ) {
      throw new BadRequestException(
        'New password and New password verification do not match',
      );
    }

    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User does not exist in our system');
    }

    // email check
    if (updateUserData.email && updateUserData.email.trim() !== user.email) {
      const isUserExist = await this.usersService.checkIfUserExistsByEmail(
        updateUserData.email,
      );
      if (isUserExist) {
        throw new BadRequestException('Email already exists in our system');
      }
    }

    // password check
    const isPasswordMatch = this.authService.comparePassword(
      updateUserData.currentPassword,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    if (updateUserData.newPassword) {
      const hashedPassword = this.authService.hashPassword(
        updateUserData.newPassword,
      );

      updateUserData.password = hashedPassword;
    }

    const { currentPassword, ...result } = await this.usersService.updateUser(
      id,
      updateUserData,
    );

    return plainToClass(User, result);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const isUserExist = await this.usersService.checkIfUserExistsById(id);
    if (!isUserExist) {
      throw new NotFoundException('User does not exist in our system');
    }

    const result = await this.usersService.deleteUserById(id);

    if (!result) {
      throw new InternalServerErrorException(
        'Error happened when deleting user',
      );
    }

    return { statusCode: 200, message: 'User deleted successfully' };
  }
}
