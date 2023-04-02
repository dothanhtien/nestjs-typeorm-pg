import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Strategy } from 'passport-custom';
import { UsersService } from 'src/users/users.service';
import TokenPayload from './interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
    super();
  }

  async validate(req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      this.jwtService.verify(token);

      const payload = this.jwtService.decode(token) as TokenPayload;

      const userId = payload.sub;
      const user = await this.usersService.getUserById(userId);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return user;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Token is invalid');
      }
    }
  }
}
