import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  plainPassword: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: USER_SELECT });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(email: string, hashedPassword: string, plainPassword: string, name?: string, role: Role = Role.USER) {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email аль хэдийн бүртгэлтэй байна');
    return this.prisma.user.create({
      data: { email, password: hashedPassword, plainPassword, name, role },
      select: USER_SELECT,
    });
  }

  async update(id: string, data: { email?: string; name?: string; role?: Role; password?: string; plainPassword?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Хэрэглэгч олдсонгүй');
    return this.prisma.user.update({ where: { id }, data, select: USER_SELECT });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Хэрэглэгч олдсонгүй');
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }
}
