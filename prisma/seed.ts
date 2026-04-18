import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@triple-genius.com' },
    update: {},
    create: { email: 'demo@triple-genius.com', password: hashed, name: 'Demo User' },
  });

  const modulesData = [
    {
      slug: 'english', icon: '🇬🇧', color: 'from-[#8b9d83] to-[#9faaa0]', order: 1,
      questions: [
        { question: 'What is the past tense of "go"?', answer: 'went' },
        { question: 'Translate: "Hello, how are you?"', answer: 'Сәлем, қалың қалай?' },
        { question: 'What does "beautiful" mean?', answer: 'әдемі / гоё' },
        { question: 'Complete: I ___ to school every day.', answer: 'go' },
        { question: 'What is a synonym for "happy"?', answer: 'joyful, cheerful, glad' },
      ],
    },
    {
      slug: 'alash', icon: '🏛️', color: 'from-[#a67c8a] to-[#b88f9c]', order: 2,
      questions: [
        { question: 'Алаш қозғалысы қашан басталды?', answer: '1917 жылы' },
        { question: 'Алаш Орданың бірінші төрағасы кім?', answer: 'Әлихан Бөкейхан' },
      ],
    },
    {
      slug: 'olen', icon: '✍️', color: 'from-[#c9a66b] to-[#d4b67d]', order: 3,
      questions: [
        { question: 'Өлең дегеніміз не?', answer: 'Ырғақты сөз өнері' },
      ],
    },
    {
      slug: 'iq', icon: '🧠', color: 'from-[#7c6f5f] to-[#8f8275]', order: 4,
      questions: [
        { question: 'If 2+2=4, what is 3+3?', answer: '6' },
        { question: 'Complete the pattern: 2, 4, 8, 16, ___', answer: '32' },
      ],
    },
    {
      slug: 'tapqirliq', icon: '💡', color: 'from-[#9b8b7e] to-[#ad9d90]', order: 5,
      questions: [
        { question: 'Шығармашылық ойлау дегеніміз не?', answer: 'Жаңа идеялар туғызу қабілеті' },
      ],
    },
    {
      slug: 'sozdik', icon: '📖', color: 'from-[#8a7f73] to-[#9c9185]', order: 6,
      questions: [
        { question: '"Мектеп" сөзінің мағынасы?', answer: 'Оқу орны' },
        { question: '"Кітап" сөзін ағылшынша айт', answer: 'Book' },
      ],
    },
  ];

  for (const data of modulesData) {
    const { questions, ...moduleData } = data;
    const mod = await prisma.module.upsert({
      where: { slug: moduleData.slug },
      update: {},
      create: moduleData,
    });

    for (const [j, q] of questions.entries()) {
      await prisma.question.create({
        data: { ...q, order: j, moduleId: mod.id },
      });
    }

    await prisma.progress.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId: mod.id } },
      update: {},
      create: { userId: user.id, moduleId: mod.id, completed: 0, total: questions.length },
    });
  }

  console.log('✅ Seed complete!');
  console.log('Demo user: demo@triple-genius.com / password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
