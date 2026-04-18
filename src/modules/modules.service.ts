import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.module.findMany({
      orderBy: { order: 'asc' },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.module.findUnique({ where: { slug } });
  }

  getQuestions(slug: string) {
    return this.prisma.question.findMany({
      where: { module: { slug } },
      orderBy: { order: 'asc' },
      select: { id: true, question: true, answer: true, order: true },
    });
  }
}
