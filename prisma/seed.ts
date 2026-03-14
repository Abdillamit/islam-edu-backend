import {
  ContentStatus,
  Language,
  MediaType,
  PrismaClient,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

type TranslationSeed = {
  lang: Language;
  title: string;
  description?: string;
};

type LessonTranslationSeed = {
  lang: Language;
  title: string;
  shortDescription: string;
  description?: string;
};

type LessonStepSeed = {
  sortOrder: number;
  translations: Array<{
    lang: Language;
    content: string;
  }>;
};

const prisma = new PrismaClient();

const categoriesSeed: Array<{
  slug: string;
  iconName: string;
  sortOrder: number;
  status: ContentStatus;
  translations: TranslationSeed[];
}> = [
  {
    slug: 'ablution-daaret',
    iconName: 'water_drop',
    sortOrder: 1,
    status: ContentStatus.published,
    translations: [
      {
        lang: Language.ky,
        title: 'Даарат',
        description: 'Дааратты туура алууну кадам сайын үйрөнүңүз.',
      },
      {
        lang: Language.ru,
        title: 'Омовение',
        description: 'Пошаговое обучение правильному омовению перед намазом.',
      },
    ],
  },
  {
    slug: 'ghusl',
    iconName: 'shower',
    sortOrder: 2,
    status: ContentStatus.published,
    translations: [
      {
        lang: Language.ky,
        title: 'Гусул',
        description: 'Толук жуунуунун шарты жана тартиби.',
      },
      {
        lang: Language.ru,
        title: 'Полное омовение',
        description: 'Условия и порядок полного омовения (гусль).',
      },
    ],
  },
  {
    slug: 'prayer-learning-namaz',
    iconName: 'mosque',
    sortOrder: 3,
    status: ContentStatus.published,
    translations: [
      {
        lang: Language.ky,
        title: 'Намаз үйрөнүү',
        description: 'Башталгычтар үчүн намаздын негизги кадамдары.',
      },
      {
        lang: Language.ru,
        title: 'Обучение намазу',
        description: 'Основные шаги намаза для начинающих.',
      },
    ],
  },
  {
    slug: 'short-surahs',
    iconName: 'menu_book',
    sortOrder: 4,
    status: ContentStatus.published,
    translations: [
      {
        lang: Language.ky,
        title: 'Кыска сүрөлөр',
        description: 'Окууга жеңил жана маанилүү кыска сүрөлөр.',
      },
      {
        lang: Language.ru,
        title: 'Короткие суры',
        description: 'Короткие и часто читаемые суры.',
      },
    ],
  },
  {
    slug: 'daily-duas',
    iconName: 'self_improvement',
    sortOrder: 5,
    status: ContentStatus.published,
    translations: [
      {
        lang: Language.ky,
        title: 'Күндөлүк дубалар',
        description: 'Күн сайын окула турган кыска дубалар.',
      },
      {
        lang: Language.ru,
        title: 'Ежедневные дуа',
        description: 'Короткие дуа для повседневной жизни.',
      },
    ],
  },
  {
    slug: 'basic-islamic-knowledge',
    iconName: 'school',
    sortOrder: 6,
    status: ContentStatus.published,
    translations: [
      {
        lang: Language.ky,
        title: 'Исламдын негиздери',
        description: 'Ишеним жана ибадат боюнча негизги түшүнүктөр.',
      },
      {
        lang: Language.ru,
        title: 'Базовые знания об исламе',
        description: 'Базовые понятия веры и поклонения.',
      },
    ],
  },
];

const lessonsSeed: Array<{
  slug: string;
  categorySlug: string;
  status: ContentStatus;
  sortOrder: number;
  isFeatured: boolean;
  imageUrl?: string;
  audioUrl?: string;
  translations: LessonTranslationSeed[];
  steps: LessonStepSeed[];
}> = [
  {
    slug: 'how-to-make-wudu',
    categorySlug: 'ablution-daaret',
    status: ContentStatus.published,
    sortOrder: 1,
    isFeatured: true,
    imageUrl: 'https://cdn.islamedu.kg/media/wudu-steps.jpg',
    audioUrl: 'https://cdn.islamedu.kg/audio/wudu-guide.mp3',
    translations: [
      {
        lang: Language.ky,
        title: 'Даарат алуу тартиби',
        shortDescription: 'Даарат алуунун жөнөкөй кадамдары.',
        description:
          'Бул сабакта дааратты тартип менен кантип алуу керектигин үйрөнөсүз.',
      },
      {
        lang: Language.ru,
        title: 'Порядок омовения',
        shortDescription: 'Простые шаги для правильного омовения.',
        description:
          'В этом уроке вы изучите последовательность малого омовения.',
      },
    ],
    steps: [
      {
        sortOrder: 1,
        translations: [
          {
            lang: Language.ky,
            content: 'Ниет кылыңыз жана «Бисмиллях» айтыңыз.',
          },
          {
            lang: Language.ru,
            content: 'Сделайте намерение и произнесите «Бисмиллях».',
          },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          { lang: Language.ky, content: 'Колду билекке чейин үч жолу жууңуз.' },
          { lang: Language.ru, content: 'Вымойте руки до запястий три раза.' },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          { lang: Language.ky, content: 'Оозду жана мурунду чайкаңыз.' },
          { lang: Language.ru, content: 'Прополощите рот и нос.' },
        ],
      },
    ],
  },
  {
    slug: 'fard-prayer-basics',
    categorySlug: 'prayer-learning-namaz',
    status: ContentStatus.published,
    sortOrder: 1,
    isFeatured: true,
    imageUrl: 'https://cdn.islamedu.kg/media/namaz-basics.jpg',
    translations: [
      {
        lang: Language.ky,
        title: 'Фарз намаздын негизи',
        shortDescription: 'Намаздын негизги бөлүктөрүн үйрөнүңүз.',
        description:
          'Бул сабак башталгычтар үчүн фарз намаздын иретин түшүндүрөт.',
      },
      {
        lang: Language.ru,
        title: 'Основы обязательного намаза',
        shortDescription: 'Изучите базовые части намаза.',
        description:
          'Урок объясняет порядок обязательного намаза для начинающих.',
      },
    ],
    steps: [
      {
        sortOrder: 1,
        translations: [
          { lang: Language.ky, content: 'Такбир менен намазды баштаңыз.' },
          { lang: Language.ru, content: 'Начните намаз с такбира.' },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          { lang: Language.ky, content: 'Кыямда сүрө окуңуз.' },
          { lang: Language.ru, content: 'В положении стоя прочитайте суру.' },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          { lang: Language.ky, content: 'Руку жана сажданы туура аткарыңыз.' },
          { lang: Language.ru, content: 'Правильно выполните руку и саджда.' },
        ],
      },
    ],
  },
  {
    slug: 'short-surah-al-fatiha',
    categorySlug: 'short-surahs',
    status: ContentStatus.published,
    sortOrder: 1,
    isFeatured: false,
    audioUrl: 'https://cdn.islamedu.kg/audio/al-fatiha.mp3',
    translations: [
      {
        lang: Language.ky,
        title: 'Фатиха сүрөөсү',
        shortDescription: 'Фатиханы окуу жана мааниси.',
        description:
          'Бул сабакта Фатиха сүрөөсүн туура окуунун негизин үйрөнөсүз.',
      },
      {
        lang: Language.ru,
        title: 'Сура Аль-Фатиха',
        shortDescription: 'Чтение и базовый смысл суры.',
        description: 'В уроке даётся базовая структура чтения Аль-Фатихи.',
      },
    ],
    steps: [
      {
        sortOrder: 1,
        translations: [
          { lang: Language.ky, content: 'Сүрө 7 аяттан турат.' },
          { lang: Language.ru, content: 'Сура состоит из 7 аятов.' },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          {
            lang: Language.ky,
            content: 'Жай жана туура айтууга көңүл буруңуз.',
          },
          {
            lang: Language.ru,
            content: 'Сосредоточьтесь на спокойном и правильном произношении.',
          },
        ],
      },
    ],
  },
  {
    slug: 'daily-morning-dua',
    categorySlug: 'daily-duas',
    status: ContentStatus.draft,
    sortOrder: 1,
    isFeatured: false,
    translations: [
      {
        lang: Language.ky,
        title: 'Эртең мененки дуба',
        shortDescription: 'Эртең менен окула турган дуба.',
        description: 'Жакынкы релизде толук түшүндүрмө кошулат.',
      },
      {
        lang: Language.ru,
        title: 'Утреннее дуа',
        shortDescription: 'Дуа для чтения по утрам.',
        description:
          'Полная версия урока будет опубликована в следующем релизе.',
      },
    ],
    steps: [
      {
        sortOrder: 1,
        translations: [
          { lang: Language.ky, content: 'Дубаны тынч абалда окуңуз.' },
          { lang: Language.ru, content: 'Читайте дуа в спокойном состоянии.' },
        ],
      },
    ],
  },
];

async function upsertAdmin() {
  const email = (
    process.env.ADMIN_SEED_EMAIL ?? 'admin@islamedu.kg'
  ).toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD ?? 'Admin123!';
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.adminUser.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      fullName: 'MVP Admin',
      isActive: true,
    },
    update: {
      passwordHash,
      fullName: 'MVP Admin',
      isActive: true,
    },
  });
}

async function seedCategories(adminId: string) {
  const categoryIdBySlug: Record<string, string> = {};

  for (const category of categoriesSeed) {
    const upserted = await prisma.category.upsert({
      where: { slug: category.slug },
      create: {
        slug: category.slug,
        iconName: category.iconName,
        sortOrder: category.sortOrder,
        status: category.status,
        createdById: adminId,
        updatedById: adminId,
      },
      update: {
        iconName: category.iconName,
        sortOrder: category.sortOrder,
        status: category.status,
        updatedById: adminId,
      },
    });

    categoryIdBySlug[category.slug] = upserted.id;

    for (const translation of category.translations) {
      await prisma.categoryTranslation.upsert({
        where: {
          categoryId_lang: {
            categoryId: upserted.id,
            lang: translation.lang,
          },
        },
        create: {
          categoryId: upserted.id,
          lang: translation.lang,
          title: translation.title,
          description: translation.description,
        },
        update: {
          title: translation.title,
          description: translation.description,
        },
      });
    }
  }

  return categoryIdBySlug;
}

async function seedLessons(
  adminId: string,
  categoryIdBySlug: Record<string, string>,
) {
  for (const lesson of lessonsSeed) {
    const categoryId = categoryIdBySlug[lesson.categorySlug];

    if (!categoryId) {
      continue;
    }

    const upserted = await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      create: {
        categoryId,
        slug: lesson.slug,
        status: lesson.status,
        sortOrder: lesson.sortOrder,
        isFeatured: lesson.isFeatured,
        imageUrl: lesson.imageUrl,
        audioUrl: lesson.audioUrl,
        createdById: adminId,
        updatedById: adminId,
      },
      update: {
        categoryId,
        status: lesson.status,
        sortOrder: lesson.sortOrder,
        isFeatured: lesson.isFeatured,
        imageUrl: lesson.imageUrl,
        audioUrl: lesson.audioUrl,
        updatedById: adminId,
      },
    });

    await prisma.lessonTranslation.deleteMany({
      where: { lessonId: upserted.id },
    });

    await prisma.lessonStep.deleteMany({
      where: { lessonId: upserted.id },
    });

    await prisma.mediaResource.deleteMany({
      where: { lessonId: upserted.id },
    });

    for (const translation of lesson.translations) {
      await prisma.lessonTranslation.create({
        data: {
          lessonId: upserted.id,
          lang: translation.lang,
          title: translation.title,
          shortDescription: translation.shortDescription,
          description: translation.description,
        },
      });
    }

    for (const step of lesson.steps) {
      const createdStep = await prisma.lessonStep.create({
        data: {
          lessonId: upserted.id,
          sortOrder: step.sortOrder,
        },
      });

      for (const stepTranslation of step.translations) {
        await prisma.lessonStepTranslation.create({
          data: {
            stepId: createdStep.id,
            lang: stepTranslation.lang,
            content: stepTranslation.content,
          },
        });
      }
    }

    const mediaResources: Array<{ type: MediaType; url: string }> = [];

    if (lesson.imageUrl) {
      mediaResources.push({ type: MediaType.image, url: lesson.imageUrl });
    }

    if (lesson.audioUrl) {
      mediaResources.push({ type: MediaType.audio, url: lesson.audioUrl });
    }

    if (mediaResources.length > 0) {
      await prisma.mediaResource.createMany({
        data: mediaResources.map((resource) => ({
          lessonId: upserted.id,
          type: resource.type,
          url: resource.url,
        })),
      });
    }
  }
}

async function main() {
  const admin = await upsertAdmin();
  const categoryIdBySlug = await seedCategories(admin.id);
  await seedLessons(admin.id, categoryIdBySlug);

  console.log('Seed completed.');
  console.log(`Admin email: ${admin.email}`);
  console.log(
    `Admin password: ${process.env.ADMIN_SEED_PASSWORD ?? 'Admin123!'}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
