import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.question.count({ where: { moduleId: '69e394f7717c2bcab1da5c6e' } });
  console.log('Question count for module:', count);
  const sample = await prisma.question.findFirst({ where: { moduleId: '69e394f7717c2bcab1da5c6e' } });
  console.log('Sample:', JSON.stringify(sample, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
