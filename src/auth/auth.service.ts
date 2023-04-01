import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor() {}

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  }

  comparePassword(password: string, hashedPassword: string) {
    const isMatch = bcrypt.compareSync(password, hashedPassword);
    return isMatch;
  }
}
