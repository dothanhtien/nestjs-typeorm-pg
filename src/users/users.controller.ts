import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(@Res() res: Response) {
    const users = await this.usersService.getAllUsers();
    res.json({ data: users });
  }

  @Post()
  async createUser(@Req() req: Request, @Res() res: Response) {
    const { first_name, last_name, email, password } = req.body;
    const newUser = await this.usersService.createUser({
      first_name,
      last_name,
      email,
      password,
    });
    res.json({ data: newUser });
  }
}
