const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();
const data = JSON.parse(fs.readFileSync('./olen.json', 'utf8'));

async function main() {
  const mod = await prisma.module.findUnique({ where: { slug: 'english' } });
  if (!mod) {
    console.error('English module not found. Run the main seed first.');
    process.exit(1);
  }

  // Remove existing questions for this module
  await prisma.question.deleteMany({ where: { moduleId: mod.id } });

  const keys = Object.keys(data).map(Number).sort((a, b) => a - b);
  let order = 0;

  for (const key of keys) {
    const entry = data[String(key)];
    await prisma.question.create({
      data: {
        question: entry.en,
        answer: entry.mn,
        order: order++,
        moduleId: mod.id,
      },
    });
  }

  // Update progress totals for all users on this module
  await prisma.progress.updateMany({
    where: { moduleId: mod.id },
    data: { total: keys.length, completed: 0 },
  });

  console.log(`✅ Inserted ${keys.length} English vocabulary questions into MongoDB.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
