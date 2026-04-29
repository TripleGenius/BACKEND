import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const MPA = '/home/nurlan/Projects/MPA_Alash/public';

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function clearModule(slug: string) {
  const mod = await prisma.module.findUnique({ where: { slug } });
  if (mod) {
    await prisma.question.deleteMany({ where: { moduleId: mod.id } });
    console.log(`🗑️  "${slug}" хуучин өгөгдөл устгагдлаа`);
  }
}

async function importEnglish(moduleId: string) {
  const data: any[] = readJson(path.join(MPA, 'english/english.json'));

  const questions = data.map((item: any, i: number) => {
    const ps = Array.isArray(item.PastSimple) ? item.PastSimple.join(' / ') : item.PastSimple;
    const pp = Array.isArray(item.PastParticiple) ? item.PastParticiple.join(' / ') : item.PastParticiple;
    return {
      question: `"${item.Infinitive}" → Past Simple?`,
      answer: ps,
      explanation: `Past Participle: ${pp}`,
      order: i,
      moduleId,
    };
  });

  await prisma.question.createMany({ data: questions });
  return questions.length;
}

async function importAlash(moduleId: string) {
  const data: Record<string, string> = readJson(path.join(MPA, 'alash_jurnal/alash.json'));

  const questions = Object.values(data)
    .filter((quote: string) => quote.includes(','))
    .map((quote: string, i: number) => {
      const commaIdx = quote.indexOf(',');
      const firstHalf = quote.slice(0, commaIdx + 1).trim();
      const secondHalf = quote.slice(commaIdx + 1).trim();
      return {
        question: firstHalf,
        answer: secondHalf,
        explanation: quote,   // бүтэн сургаал үг explanation-д
        order: i,
        moduleId,
      };
    });

  await prisma.question.createMany({ data: questions });
  return questions.length;
}

async function importOlen(moduleId: string) {
  const data: { question: string; answer: string; order: number }[] =
    readJson(path.join(__dirname, '../olen-seed.json'));

  const questions = data.map((item, i) => ({
    question: item.question,
    answer: item.answer,
    order: item.order ?? i,
    moduleId,
  }));

  await prisma.question.createMany({ data: questions });
  return questions.length;
}

async function importTapqirliq(moduleId: string) {
  const keywords: Record<string, string> = readJson(path.join(MPA, 'taphirlih/tap.json'));
  const proverbs: Record<string, string> = readJson(path.join(MPA, 'taphirlih/tap_answer.json'));

  const proverbList = Object.values(proverbs);

  const questions: any[] = Object.values(keywords).map((word: string, i: number) => {
    const matched = proverbList
      .filter(p => word.split(' ').some(part => p.toLowerCase().includes(part.toLowerCase())))
      .join('\n');
    return {
      question: `«${word}» сөзі кіретін мақалды атаңыз`,
      answer: matched || proverbList[i % proverbList.length],
      order: i,
      moduleId,
    };
  });

  await prisma.question.createMany({ data: questions });
  return questions.length;
}

async function importSozdik(moduleId: string) {
  const data: { үг: string; утга: string[] }[] = readJson(
    path.join(__dirname, '../triple-data.json'),
  );

  const questions = data.map((item, i) => ({
    question: item['үг'],
    answer: item['утга'][0],
    explanation: JSON.stringify(item['утга']),
    order: i,
    moduleId,
  }));

  await prisma.question.createMany({ data: questions });
  return questions.length;
}

async function main() {
  console.log('📦 Import эхэлж байна...\n');

  const targets = ['english', 'alash', 'olen', 'tapqirliq', 'sozdik'];

  for (const slug of targets) {
    await clearModule(slug);
  }
  console.log('');

  for (const slug of targets) {
    const mod = await prisma.module.findUnique({ where: { slug } });
    if (!mod) {
      console.log(`⚠️  "${slug}" module олдсонгүй — эхлээд "npm run db:seed" ажиллуул`);
      continue;
    }

    let count = 0;
    if (slug === 'english')    count = await importEnglish(mod.id);
    if (slug === 'alash')      count = await importAlash(mod.id);
    if (slug === 'olen')       count = await importOlen(mod.id);
    if (slug === 'tapqirliq')  count = await importTapqirliq(mod.id);
    if (slug === 'sozdik')     count = await importSozdik(mod.id);

    await prisma.progress.updateMany({
      where: { moduleId: mod.id },
      data: { total: count },
    });

    console.log(`✅ ${slug}: ${count} асуулт MongoDB-д хадгалагдлаа`);
  }

  console.log('\n🎉 Import дууслаа!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
