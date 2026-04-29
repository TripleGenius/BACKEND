import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: any) {
    return this.users.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  getAll() {
    return this.users.findAll();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async createUser(
    @Body() body: { email: string; password: string; name?: string; role?: Role },
  ) {
    const hashed = await bcrypt.hash(body.password, 10);
    return this.users.create(body.email, hashed, body.password, body.name, body.role);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { email?: string; name?: string; role?: Role; password?: string },
  ) {
    const data: any = {};
    if (body.email) data.email = body.email;
    if (body.name !== undefined) data.name = body.name;
    if (body.role) data.role = body.role;
    if (body.password) {
      data.password = await bcrypt.hash(body.password, 10);
      data.plainPassword = body.password;
    }
    return this.users.update(id, data);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.users.delete(id);
  }
}
