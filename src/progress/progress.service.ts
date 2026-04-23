import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    const rows = await this.prisma.progress.findMany({
      where: { userId },
      include: { module: { select: { slug: true, icon: true, color: true } } },
    });

    return rows.map((r) => ({
      moduleSlug: r.module.slug,
      icon: r.module.icon,
      color: r.module.color,
      completed: r.completed,
      total: r.total,
      progress: r.total > 0 ? Math.round((r.completed / r.total) * 100) : 0,
    }));
  }

  async update(userId: string, moduleSlug: string, completed: number) {
    const mod = await this.prisma.module.findUnique({
      where: { slug: moduleSlug },
      include: { _count: { select: { questions: true } } },
    });
    if (!mod) return null;

    const total = mod._count.questions;

    return this.prisma.progress.upsert({
      where: { userId_moduleId: { userId, moduleId: mod.id } },
      update: { completed, total },
      create: { userId, moduleId: mod.id, completed, total },
    });
  }
}
