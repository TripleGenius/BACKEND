import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const englishQuestions = [
  {
    question: "I'm eating pizza at the park right now.",
    answer: "Би яг одоо паркад пицца идэж байна.",
  },
  {
    question: "Not only did I have a headache, but I also had a sore throat.",
    answer: "Миний зөвхөн толгой өвдөөгүй, бас хоолой өвдөж байсан.",
  },
  {
    question: "I have been working all day, which is why I feel exhausted.",
    answer: "Би бүтэн өдөр ажилласан болохоор маш их ядарч байна.",
  },
  {
    question: "Had I known about the meeting earlier, I would have attended it.",
    answer: "Хэрвээ би уулзалтын талаар эрт мэдсэн бол оролцох байсан.",
  },
  {
    question: "She speaks as if she had lived abroad for years.",
    answer: "Тэр гадаадад олон жил амьдарсан юм шиг ярьдаг.",
  },
  {
    question: "What I find most interesting is how technology continues to evolve rapidly.",
    answer: "Миний хамгийн сонирхолтой гэж боддог зүйл бол технологи маш хурдан хөгжиж байгаа явдал.",
  },
  {
    question: "Rarely do we get such an opportunity to learn from experts.",
    answer: "Бид ийм мэргэжилтнүүдээс суралцах боломж ховор олддог.",
  },
  {
    question: "He seems to be struggling, despite his attempt to maintain a calm attitude.",
    answer: "Тэр тайван байдал хадгалах гэж оролдож байгаа ч асуудалтай байгаа бололтой.",
  },
  {
    question: "The book, which was recommended by my teacher, turned out to be very useful.",
    answer: "Багшийн зөвлөсөн ном маш хэрэгтэй болж таарсан.",
  },
  {
    question: "I would rather stay at home than go out in this weather.",
    answer: "Би ийм цаг агаарт гадагшаа гарахаас илүү гэртээ байхыг илүүд үзнэ.",
  },
  {
    question: "By the time we arrived, the concert had already started.",
    answer: "Биднийг очиход концерт аль хэдийн эхэлчихсэн байсан.",
  },
  {
    question: "It was not until I saw the results that I could interpret the data correctly.",
    answer: "Үр дүнг харах хүртлээ би өгөгдлийг зөв тайлбарлаж чадаагүй.",
  },
  {
    question: "She is believed to be one of the most talented students in the class.",
    answer: "Түүнийг ангийнхаа хамгийн авьяастай сурагчдын нэг гэж үздэг.",
  },
  {
    question: "If I were in your position, I would consider changing jobs.",
    answer: "Хэрвээ би чиний оронд байсан бол ажлаа солих талаар бодох байсан.",
  },
  {
    question: "The more you practice, the more you can improve your performance.",
    answer: "Илүү их давтах тусам гүйцэтгэлээ сайжруулж чадна.",
  },
  {
    question: "Having finished his homework, he went out to meet his friends.",
    answer: "Гэрийн даалгавраа хийж дуусаад найзуудтайгаа уулзахаар гарсан.",
  },
  {
    question: "She tends to overthink things, which can negatively affect her decisions.",
    answer: "Тэр их бодлогоширох хандлагатай бөгөөд энэ нь шийдвэрт нь сөргөөр нөлөөлдөг.",
  },
  {
    question: "I wish I had taken your advice earlier.",
    answer: "Чиний зөвлөгөөг эрт авсан болоосой гэж бодож байна.",
  },
  {
    question: "No matter how hard it gets, you should not give up.",
    answer: "Хэчнээн хэцүү байсан ч чи бууж өгч болохгүй.",
  },
  {
    question: "The project is expected to achieve its goals by next week.",
    answer: "Төсөл ирэх долоо хоног гэхэд зорилгоо биелүүлэх төлөвтэй байна.",
  },
  {
    question: "He denied having taken the money.",
    answer: "Тэр мөнгийг авсан гэдгээ үгүйсгэсэн.",
  },
  {
    question: "It is essential to consider all possible outcomes before making a decision.",
    answer: "Шийдвэр гаргахаас өмнө бүх боломжит үр дүнг анхаарах нь чухал.",
  },
  {
    question: "She hardly ever complains, even when things go wrong.",
    answer: "Бүх зүйл буруу болсон ч тэр бараг гомдоллодоггүй.",
  },
  {
    question: "I was about to leave when you called me.",
    answer: "Чи над руу залгах үед би гарах гэж байсан.",
  },
  {
    question: "He managed to solve the problem without asking for help.",
    answer: "Тэр тусламж хүсэлгүйгээр асуудлыг шийдэж чадсан.",
  },
  {
    question: "The sooner we start, the more efficiently we can complete the task.",
    answer: "Бид хурдан эхлэх тусам ажлыг илүү үр дүнтэй дуусгана.",
  },
  {
    question: "She is not only intelligent but also extremely hardworking.",
    answer: "Тэр зөвхөн ухаантай биш бас маш шаргуу.",
  },
  {
    question: "I regret not taking the opportunity to develop my skills.",
    answer: "Ур чадвараа хөгжүүлэх боломжийг ашиглаагүйдээ харамсаж байна.",
  },
  {
    question: "Even if it rains, we will continue with our plans.",
    answer: "Бороо орсон ч бид төлөвлөгөөгөө үргэлжлүүлнэ.",
  },
  {
    question: "He was seen leaving the building late at night.",
    answer: "Түүнийг шөнө орой барилгаас гарч байгааг харсан.",
  },
];

async function main() {
  console.log('🇬🇧 English асуултуудыг MongoDB-д оруулж байна...\n');

  const mod = await prisma.module.findUnique({ where: { slug: 'english' } });
  if (!mod) {
    console.log('⚠️  "english" module олдсонгүй — эхлээд npm run db:seed ажиллуул');
    return;
  }

  await prisma.question.deleteMany({ where: { moduleId: mod.id } });
  console.log('🗑️  Хуучин English асуултууд устгагдлаа');

  await prisma.question.createMany({
    data: englishQuestions.map((q, i) => ({ ...q, order: i, moduleId: mod.id })),
  });

  await prisma.progress.updateMany({
    where: { moduleId: mod.id },
    data: { total: englishQuestions.length },
  });

  console.log(`✅ English: ${englishQuestions.length} асуулт MongoDB-д хадгалагдлаа`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
