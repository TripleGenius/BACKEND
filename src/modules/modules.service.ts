import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

type Partition = 'AB' | 'BC' | 'AC' | 'ALL';

// olen module-д хэн ямар хэсгийг харах вэ (нэрээр тодорхойлно)
const OLEN_PARTITIONS: Record<string, Partition> = {
  nurjaina: 'AB', // эхний 2/3
  nurlan:   'BC', // сүүлийн 2/3
  madina:   'AC', // эхний 1/3 + сүүлийн 1/3
};

function applyPartition<T>(items: T[], partition: Partition): T[] {
  const n = items.length;
  const third = Math.floor(n / 3);
  const A = items.slice(0, third);
  const B = items.slice(third, third * 2);
  const C = items.slice(third * 2);

  switch (partition) {
    case 'AB':  return [...A, ...B];
    case 'BC':  return [...B, ...C];
    case 'AC':  return [...A, ...C];
    default:    return items;
  }
}

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.module.findMany({ orderBy: { order: 'asc' } });
  }

  findBySlug(slug: string) {
    return this.prisma.module.findUnique({ where: { slug } });
  }

  async getQuestions(slug: string, lang: string = 'kk', userId?: string) {
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

    const mapped = rows.map((r) => ({
      id: r.id,
      order: r.order,
      question:    lang === 'mn' && r.questionMn    ? r.questionMn    : r.question,
      answer:      lang === 'mn' && r.answerMn      ? r.answerMn      : r.answer,
      explanation: lang === 'mn' && r.explanationMn ? r.explanationMn : r.explanation,
    }));

    if (slug !== 'olen' || !userId) return mapped;


    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const name = (user?.name ?? '').trim().toLowerCase();
    const partition = OLEN_PARTITIONS[name] ?? 'ALL';
    return applyPartition(mapped, partition);
  }

  getSozdikWords(): { word: string; meanings: string[] }[] {
    const filePath = path.join(process.cwd(), 'triple-data.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data: { үг: string; утга: string[] }[] = JSON.parse(raw);
    return data.map((item) => ({ word: item['үг'], meanings: item['утга'] }));
  }
}
