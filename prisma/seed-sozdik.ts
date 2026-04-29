import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const mod = await prisma.module.findUnique({ where: { slug: 'sozdik' } });
  if (!mod) {
    console.log('⚠️  "sozdik" module олдсонгүй — эхлээд "npm run db:seed" ажиллуул');
    return;
  }

  await prisma.question.deleteMany({ where: { moduleId: mod.id } });
  console.log('🗑️  Хуучин sozdik өгөгдөл устгагдлаа');

  const raw = fs.readFileSync(
    path.join(__dirname, '../triple-data.json'),
    'utf-8',
  );
  const data: { үг: string; утга: string[] }[] = JSON.parse(raw);

  const questions = data.map((item, i) => ({
    question: item['үг'],
    answer: item['утга'][0],
    explanation: JSON.stringify(item['утга']),
    order: i,
    moduleId: mod.id,
  }));

  await prisma.question.createMany({ data: questions });

  await prisma.progress.updateMany({
    where: { moduleId: mod.id },
    data: { total: questions.length },
  });

  console.log(`✅ sozdik: ${questions.length} асуулт MongoDB-д хадгалагдлаа`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
