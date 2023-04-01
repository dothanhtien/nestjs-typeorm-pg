import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import User from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import TokenPayload from './interface/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  }

  comparePassword(password: string, hashedPassword: string) {
    const isMatch = bcrypt.compareSync(password, hashedPassword);
    return isMatch;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordMatch = this.comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return null;
    }

    return user;
  }

  generateAccessToken(userId: string) {
    const payload: TokenPayload = { sub: userId };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
