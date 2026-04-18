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

  async getQuestions(slug: string, lang: string = 'kk') {
    const rows = await this.prisma.question.findMany({
      where: { module: { slug } },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        question: true, answer: true, explanation: true,
        questionMn: true, answerMn: true, explanationMn: true,
        order: true,
      },
    });

    return rows.map((r) => ({
      id: r.id,
      order: r.order,
      question:    lang === 'mn' && r.questionMn    ? r.questionMn    : r.question,
      answer:      lang === 'mn' && r.answerMn      ? r.answerMn      : r.answer,
      explanation: lang === 'mn' && r.explanationMn ? r.explanationMn : r.explanation,
    }));
  }
}
