import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();
const MODULE_ID = process.argv[2];

async function main() {
  if (!MODULE_ID) {
    console.error('Usage: npx ts-node seed-olen-prisma.ts <moduleId>');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync('./olen.json', 'utf8')) as Record<string, string>;
  const keys = Object.keys(raw).map(Number).sort((a, b) => a - b);

  const data = [];
  for (let i = 0; i < keys.length; i += 2) {
    const qKey = keys[i];
    const aKey = keys[i + 1];
    if (aKey === undefined) break;

    data.push({
      question: raw[String(qKey)],
      answer: raw[String(aKey)],
      order: Math.ceil(qKey / 2),
      moduleId: MODULE_ID,
    });
  }

  const result = await prisma.question.createMany({ data });
  console.log(`Inserted: ${result.count} questions`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
