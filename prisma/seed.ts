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

type LessonReferenceSeed = {
  sortOrder: number;
  sourceName: string;
  title: string;
  url: string;
  verificationNote?: string;
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
        description:
          'Даараттын парздары, шарттары жана күнүмдүк колдонуу эрежелери.',
      },
      {
        lang: Language.ru,
        title: 'Омовение',
        description:
          'Порядок малого омовения, обязательные элементы и частые ошибки.',
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
        description: 'Толук жуунуунун милдеттүү учурлары жана кадамдары.',
      },
      {
        lang: Language.ru,
        title: 'Полное омовение',
        description: 'Когда требуется гусль и как его выполнять по шагам.',
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
        description:
          'Намаз убакыттары, ракааттар жана башталгычтар үчүн негизги тартип.',
      },
      {
        lang: Language.ru,
        title: 'Обучение намазу',
        description:
          'Времена намаза, ракааты и практический порядок для начинающих.',
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
        description: 'Намазда көп окулуучу кыска сүрөлөрдү үйрөнүңүз.',
      },
      {
        lang: Language.ru,
        title: 'Короткие суры',
        description: 'Короткие суры для ежедневного чтения в намазе.',
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
        description:
          'Эртең менен, кечинде жана уктаар алдында окулуучу дубалар.',
      },
      {
        lang: Language.ru,
        title: 'Ежедневные дуа',
        description:
          'Короткие дуа и азкары на каждый день: утро, вечер, перед сном.',
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
        title: 'Ислам негиздери',
        description:
          'Исламдын 5 түркүгү жана ыймандын 6 шарты боюнча баштапкы билим.',
      },
      {
        lang: Language.ru,
        title: 'Основы ислама',
        description:
          'Пять столпов ислама и шесть столпов имана в понятном формате.',
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
  videoUrl?: string;
  translations: LessonTranslationSeed[];
  steps: LessonStepSeed[];
  references: LessonReferenceSeed[];
}> = [
  {
    slug: 'wudu-fard-and-order',
    categorySlug: 'ablution-daaret',
    status: ContentStatus.published,
    sortOrder: 1,
    isFeatured: true,
    videoUrl: 'https://www.youtube.com/watch?v=6l0G9d6dXoU',
    translations: [
      {
        lang: Language.ky,
        title: 'Даарат: парздары жана тартиби',
        shortDescription:
          'Даараттын негизги кадамдары жана милдеттүү бөлүктөрү.',
        description:
          'Бул сабакта даарат алуунун парздары, тартиби жана күнүмдүк практикада эң көп кетирилген каталар көрсөтүлөт.',
      },
      {
        lang: Language.ru,
        title: 'Омовение: обязательные действия и порядок',
        shortDescription: 'Пошаговый порядок малого омовения для начинающих.',
        description:
          'Урок объясняет обязательные элементы вуду и последовательность действий без сложной терминологии.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
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
        sortOrder: 1,
        translations: [
          { lang: Language.ky, content: 'Колду билекке чейин 3 жолу жууңуз.' },
          { lang: Language.ru, content: 'Вымойте руки до запястий 3 раза.' },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          { lang: Language.ky, content: 'Оозду жана мурунду 3 жолу чайкаңыз.' },
          {
            lang: Language.ru,
            content: 'Прополощите рот и нос по 3 раза.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          {
            lang: Language.ky,
            content: 'Бетти чач сызыгынан ээкке чейин жууңуз.',
          },
          {
            lang: Language.ru,
            content: 'Вымойте лицо от линии волос до подбородка.',
          },
        ],
      },
      {
        sortOrder: 4,
        translations: [
          {
            lang: Language.ky,
            content: 'Оң жана сол колду чыканак менен кошо жууңуз.',
          },
          {
            lang: Language.ru,
            content: 'Вымойте правую и левую руку вместе с локтями.',
          },
        ],
      },
      {
        sortOrder: 5,
        translations: [
          {
            lang: Language.ky,
            content: 'Башка масх тартыңыз, андан соң кулактарды сүртүңүз.',
          },
          {
            lang: Language.ru,
            content: 'Сделайте масх головы, затем протрите уши.',
          },
        ],
      },
      {
        sortOrder: 6,
        translations: [
          {
            lang: Language.ky,
            content: 'Буттарды томук менен кошо 3 жолу жууңуз.',
          },
          {
            lang: Language.ru,
            content: 'Вымойте стопы вместе с щиколотками 3 раза.',
          },
        ],
      },
      {
        sortOrder: 7,
        translations: [
          {
            lang: Language.ky,
            content: 'Даараттан кийин кыска дуба окуп, тазалыкты сактаңыз.',
          },
          {
            lang: Language.ru,
            content:
              'После омовения прочитайте короткое дуа и сохраняйте чистоту.',
          },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Quran',
        title: 'Сура Аль-Маида 5:6 (порядок омовения)',
        url: 'https://quran.com/5/6',
        verificationNote: 'Базовый аят по омовению.',
      },
      {
        sortOrder: 1,
        sourceName: 'Sahih Muslim',
        title: 'Хадис о важности чистоты',
        url: 'https://sunnah.com/muslim:223',
      },
      {
        sortOrder: 2,
        sourceName: 'Муфтият Кыргызстана',
        title: 'Официальный портал ДУМК',
        url: 'https://muftiyat.kg/',
      },
    ],
  },
  {
    slug: 'wudu-invalidators',
    categorySlug: 'ablution-daaret',
    status: ContentStatus.published,
    sortOrder: 2,
    isFeatured: false,
    translations: [
      {
        lang: Language.ky,
        title: 'Дааратты эмне бузат?',
        shortDescription: 'Даараттын бузулуучу негизги учурлары.',
        description:
          'Бул сабак дааратты бузган абалдарды эске тутууга жардам берет жана намазга чейин текшерүү тизмесин берет.',
      },
      {
        lang: Language.ru,
        title: 'Что нарушает омовение',
        shortDescription: 'Основные случаи, когда нужно обновить вуду.',
        description:
          'Список распространённых ситуаций, после которых омовение нужно сделать заново.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          { lang: Language.ky, content: 'Даарат бүтмөйүнчө намазга турбаңыз.' },
          {
            lang: Language.ru,
            content: 'Перед намазом убедитесь, что омовение не нарушено.',
          },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          {
            lang: Language.ky,
            content: 'Даарат адатта даараткана муктаждыгынан кийин бузулат.',
          },
          {
            lang: Language.ru,
            content: 'Омовение обычно нарушается после естественных нужд.',
          },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          {
            lang: Language.ky,
            content: 'Терең уктоо дааратты жаңылоону талап кылышы мүмкүн.',
          },
          {
            lang: Language.ru,
            content: 'Глубокий сон может требовать обновления омовения.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          { lang: Language.ky, content: 'Шектенсеңиз, кайра даарат алыңыз.' },
          {
            lang: Language.ru,
            content: 'При сомнении лучше сделать омовение заново.',
          },
        ],
      },
      {
        sortOrder: 4,
        translations: [
          {
            lang: Language.ky,
            content: 'Даараттын тартибин кыскача кайра кайталаңыз.',
          },
          {
            lang: Language.ru,
            content: 'Кратко повторите порядок омовения для уверенности.',
          },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Quran',
        title: 'Сура Ан-Ниса 4:43 (чистота перед намазом)',
        url: 'https://quran.com/4/43',
      },
      {
        sortOrder: 1,
        sourceName: 'IslamHouse (RU)',
        title: 'Библиотека материалов по фикху омовения',
        url: 'https://islamhouse.com/ru/',
      },
    ],
  },
  {
    slug: 'ghusl-when-required',
    categorySlug: 'ghusl',
    status: ContentStatus.published,
    sortOrder: 1,
    isFeatured: false,
    translations: [
      {
        lang: Language.ky,
        title: 'Гусул качан милдеттүү болот?',
        shortDescription: 'Толук жуунуу керек болгон негизги учурлар.',
        description:
          'Бул сабакта гусул милдеттүү болгон учурлардын жалпы тизмеси жана коопсуз окуу үчүн эскертмелер берилет.',
      },
      {
        lang: Language.ru,
        title: 'Когда гусль обязателен',
        shortDescription:
          'Основные случаи, в которых требуется полное омовение.',
        description:
          'Краткий список ситуаций, когда необходимо совершить гусль перед поклонением.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          {
            lang: Language.ky,
            content: 'Гусул ибадатка даярдык үчүн чоң тазалык болуп саналат.',
          },
          {
            lang: Language.ru,
            content: 'Гусль - это большое очищение перед поклонением.',
          },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          {
            lang: Language.ky,
            content:
              'Гусулдун милдеттүү учурларын ишенимдүү булактан үйрөнүңүз.',
          },
          {
            lang: Language.ru,
            content:
              'Изучайте обязательные случаи гусля по надёжным источникам.',
          },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          {
            lang: Language.ky,
            content: 'Эгер күмөн болсо, жергиликтүү имамдан тактаңыз.',
          },
          {
            lang: Language.ru,
            content: 'При сомнении уточняйте детали у местного имама.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          {
            lang: Language.ky,
            content: 'Гусул алдында ниет жана жалпы тазалыкты сактаңыз.',
          },
          {
            lang: Language.ru,
            content: 'Перед гуслем сделайте намерение и обеспечьте чистоту.',
          },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Quran',
        title: 'Сура Аль-Маида 5:6 (указание о полном очищении)',
        url: 'https://quran.com/5/6',
      },
      {
        sortOrder: 1,
        sourceName: 'Quran',
        title: 'Сура Аль-Бакара 2:222 (о чистоте)',
        url: 'https://quran.com/2/222',
      },
      {
        sortOrder: 2,
        sourceName: 'Муфтият Кыргызстана',
        title: 'Официальный портал ДУМК',
        url: 'https://muftiyat.kg/',
      },
    ],
  },
  {
    slug: 'ghusl-step-by-step',
    categorySlug: 'ghusl',
    status: ContentStatus.published,
    sortOrder: 2,
    isFeatured: true,
    videoUrl: 'https://youtu.be/RwxwypGxMJQ',
    translations: [
      {
        lang: Language.ky,
        title: 'Гусул: кадам сайын тартип',
        shortDescription: 'Толук жуунуунун жөнөкөй жана түшүнүктүү тартиби.',
        description:
          'Башталгычтар үчүн гусулдун практикалык аткаруу тартиби. Мазхаб боюнча деталдар айырмаланышы мүмкүн.',
      },
      {
        lang: Language.ru,
        title: 'Гусль: пошаговое выполнение',
        shortDescription: 'Практический порядок полного омовения.',
        description:
          'Понятная последовательность гусля для новичков с напоминанием сверяться с местной практикой.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
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
        sortOrder: 1,
        translations: [
          { lang: Language.ky, content: 'Эң оболу жеке тазалыкты аткарыңыз.' },
          { lang: Language.ru, content: 'Сначала выполните личную гигиену.' },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          { lang: Language.ky, content: 'Кадимки даарат алыңыз.' },
          { lang: Language.ru, content: 'Совершите обычное омовение (вуду).' },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          { lang: Language.ky, content: 'Башка 3 жолу суу куюңуз.' },
          { lang: Language.ru, content: 'Полейте голову водой 3 раза.' },
        ],
      },
      {
        sortOrder: 4,
        translations: [
          {
            lang: Language.ky,
            content: 'Денеңиздин бардык жерине суу жеткенине ынаныңыз.',
          },
          {
            lang: Language.ru,
            content: 'Проследите, чтобы вода дошла до всех участков тела.',
          },
        ],
      },
      {
        sortOrder: 5,
        translations: [
          { lang: Language.ky, content: 'Акырында буттарды жакшылап жууңуз.' },
          { lang: Language.ru, content: 'В конце тщательно вымойте ноги.' },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Quran',
        title: 'Сура Аль-Маида 5:6',
        url: 'https://quran.com/5/6',
      },
      {
        sortOrder: 1,
        sourceName: 'YouTube',
        title: 'Практическая демонстрация гусля',
        url: 'https://youtu.be/RwxwypGxMJQ',
      },
    ],
  },
  {
    slug: 'prayer-times-and-rakah',
    categorySlug: 'prayer-learning-namaz',
    status: ContentStatus.published,
    sortOrder: 1,
    isFeatured: true,
    translations: [
      {
        lang: Language.ky,
        title: 'Намаз убакыттары жана ракааттар',
        shortDescription: '5 убак намаздын жалпы түзүлүшү.',
        description:
          'Бул сабакта беш убак намаздын убакыттары жана негизги ракаат түзүлүшү жөнөкөй форматта түшүндүрүлөт.',
      },
      {
        lang: Language.ru,
        title: 'Времена намаза и ракааты',
        shortDescription: 'Общая структура 5 обязательных молитв.',
        description:
          'Урок даёт обзор времени намазов и количества ракаатов для начинающих.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          {
            lang: Language.ky,
            content: 'Намаз убакыттары: багымдат, бешим, аср, шам, куптан.',
          },
          {
            lang: Language.ru,
            content: 'Времена: фаджр, зухр, аср, магриб, иша.',
          },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          {
            lang: Language.ky,
            content: 'Ар бир намаздын фарз ракааттарын өзүнчө жаттаңыз.',
          },
          {
            lang: Language.ru,
            content: 'Выучите обязательные ракааты каждого намаза отдельно.',
          },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          {
            lang: Language.ky,
            content:
              'Адегенде тууралыкка көңүл буруңуз, анан ылдамдыкка өтүңүз.',
          },
          {
            lang: Language.ru,
            content: 'Сначала следите за правильностью, потом за скоростью.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          {
            lang: Language.ky,
            content: 'Намаз убакыттарын жергиликтүү календардан текшериңиз.',
          },
          {
            lang: Language.ru,
            content: 'Сверяйте время намаза с местным календарём.',
          },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Quran',
        title: 'Сура Та-Ха 20:14 (установление молитвы)',
        url: 'https://quran.com/20/14',
      },
      {
        sortOrder: 1,
        sourceName: 'Quran',
        title: 'Сура Аль-Исра 17:78 (времена молитвы)',
        url: 'https://quran.com/17/78',
      },
      {
        sortOrder: 2,
        sourceName: 'Sahih al-Bukhari',
        title: 'Молитесь так, как видели, что молюсь я',
        url: 'https://sunnah.com/bukhari:631',
      },
    ],
  },
  {
    slug: 'fajr-two-rakah-practice',
    categorySlug: 'prayer-learning-namaz',
    status: ContentStatus.published,
    sortOrder: 2,
    isFeatured: false,
    videoUrl: 'https://youtu.be/1JFpSP7Z5Ec',
    translations: [
      {
        lang: Language.ky,
        title: 'Багымдат намазы: 2 ракаат практикалык сабак',
        shortDescription: '2 ракаат намазды ирет менен үйрөнүү.',
        description:
          'Жөнөкөй практика: ниет, такбир, кыям, руку, сажда жана ташаххуд тартиби.',
      },
      {
        lang: Language.ru,
        title: 'Фаджр: практика двух ракаатов',
        shortDescription: 'Практический порядок 2 ракаатов для новичков.',
        description:
          'Короткий пошаговый план для первого самостоятельного выполнения намаза.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          { lang: Language.ky, content: 'Ниет кылып, кыбылага туруңуз.' },
          {
            lang: Language.ru,
            content: 'Сделайте намерение и встаньте к кыбле.',
          },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          { lang: Language.ky, content: 'Такбир айтып намазды баштаңыз.' },
          { lang: Language.ru, content: 'Начните намаз с такбира.' },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          {
            lang: Language.ky,
            content: 'Кыямда Фатиха жана кыска сүрө окуңуз.',
          },
          {
            lang: Language.ru,
            content: 'В кыяме прочитайте Аль-Фатиху и короткую суру.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          { lang: Language.ky, content: 'Руку жана эки сажданы аткарыңыз.' },
          { lang: Language.ru, content: 'Выполните руку и две саджды.' },
        ],
      },
      {
        sortOrder: 4,
        translations: [
          {
            lang: Language.ky,
            content: 'Экинчи ракаатты ушул эле тартипте бүтүрүңүз.',
          },
          {
            lang: Language.ru,
            content: 'Выполните второй ракаат в той же последовательности.',
          },
        ],
      },
      {
        sortOrder: 5,
        translations: [
          {
            lang: Language.ky,
            content: 'Ташаххуд, салават жана салам менен аяктаңыз.',
          },
          {
            lang: Language.ru,
            content: 'Завершите ташаххудом, салаватом и салямом.',
          },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Sahih al-Bukhari',
        title: 'Молитесь так, как видели, что молюсь я',
        url: 'https://sunnah.com/bukhari:631',
      },
      {
        sortOrder: 1,
        sourceName: 'YouTube',
        title: 'Видеопрактика 2 ракаатов',
        url: 'https://youtu.be/1JFpSP7Z5Ec',
      },
    ],
  },
  {
    slug: 'surah-al-fatiha-basic',
    categorySlug: 'short-surahs',
    status: ContentStatus.published,
    sortOrder: 1,
    isFeatured: false,
    videoUrl: 'https://www.youtube.com/watch?v=n3E3Bz1Vk6U',
    translations: [
      {
        lang: Language.ky,
        title: 'Фатиха сүрөсү: негизги окуу',
        shortDescription: 'Фатиханы туура окуу үчүн негиздер.',
        description:
          'Фатиха - ар бир ракаатта окулуучу негизги сүрө. Бул сабакта машыгуу ыкмасы берилет.',
      },
      {
        lang: Language.ru,
        title: 'Сура Аль-Фатиха: базовое чтение',
        shortDescription: 'Пошаговое освоение чтения Аль-Фатихи.',
        description:
          'Урок помогает выстроить ежедневную практику правильного чтения и повторения.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          { lang: Language.ky, content: 'Сүрө 7 аяттан турарын эстеңиз.' },
          {
            lang: Language.ru,
            content: 'Запомните, что сура состоит из 7 аятов.',
          },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          {
            lang: Language.ky,
            content: 'Алгач жай темпте угуп, анан кайталаңыз.',
          },
          {
            lang: Language.ru,
            content: 'Сначала слушайте медленно, затем повторяйте.',
          },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          { lang: Language.ky, content: 'Кыйын сөздөрдү өзүнчө машыгыңыз.' },
          {
            lang: Language.ru,
            content: 'Сложные слова отрабатывайте отдельно.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          {
            lang: Language.ky,
            content: 'Күн сайын 5-10 мүнөт туруктуу машыгуу жасаңыз.',
          },
          {
            lang: Language.ru,
            content: 'Практикуйтесь ежедневно по 5-10 минут.',
          },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Quran',
        title: 'Сура Аль-Фатиха',
        url: 'https://quran.com/1',
      },
      {
        sortOrder: 1,
        sourceName: 'YouTube',
        title: 'Таджвид и разбор Аль-Фатихи',
        url: 'https://www.youtube.com/watch?v=n3E3Bz1Vk6U',
      },
    ],
  },
  {
    slug: 'surah-al-ikhlas-basic',
    categorySlug: 'short-surahs',
    status: ContentStatus.published,
    sortOrder: 2,
    isFeatured: false,
    videoUrl: 'https://www.youtube.com/watch?v=7SmGTrTFbzE',
    translations: [
      {
        lang: Language.ky,
        title: 'Ихлас сүрөсү: окуу жана мааниси',
        shortDescription: 'Кыска сүрөнү жаттоо үчүн практикалык кадамдар.',
        description:
          'Ихлас сүрөсү кыска болгондуктан, башталгычтар үчүн жаттоого ыңгайлуу.',
      },
      {
        lang: Language.ru,
        title: 'Сура Аль-Ихляс: чтение и смысл',
        shortDescription: 'Короткая сура для регулярной практики и заучивания.',
        description:
          'Урок поможет выучить Аль-Ихляс с правильным произношением.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          { lang: Language.ky, content: 'Сүрө 4 аяттан турат.' },
          { lang: Language.ru, content: 'Сура состоит из 4 аятов.' },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          {
            lang: Language.ky,
            content: 'Ар бир аятты өзүнчө 5-7 жолу кайталаңыз.',
          },
          {
            lang: Language.ru,
            content: 'Повторяйте каждый аят отдельно 5-7 раз.',
          },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          {
            lang: Language.ky,
            content: 'Андан кийин бардык аяттарды бириктирип окуңуз.',
          },
          {
            lang: Language.ru,
            content: 'Затем соедините все аяты в одно чтение.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          {
            lang: Language.ky,
            content: 'Намазда Фатихадан кийин бул сүрөнү окуп машыгыңыз.',
          },
          {
            lang: Language.ru,
            content: 'Практикуйте чтение после Аль-Фатихи в намазе.',
          },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Quran',
        title: 'Сура Аль-Ихляс',
        url: 'https://quran.com/112',
      },
      {
        sortOrder: 1,
        sourceName: 'YouTube',
        title: 'Чтение суры Аль-Ихляс с таджвидом',
        url: 'https://www.youtube.com/watch?v=7SmGTrTFbzE',
      },
    ],
  },
  {
    slug: 'morning-dhikr-short',
    categorySlug: 'daily-duas',
    status: ContentStatus.published,
    sortOrder: 1,
    isFeatured: false,
    translations: [
      {
        lang: Language.ky,
        title: 'Эртең мененки кыска азкарлар',
        shortDescription: 'Күндү баштоого ылайыктуу жөнөкөй азкарлар.',
        description:
          'Эртең менен 3-5 мүнөт убакыт бөлүп, кыска азкарларды туруктуу окуу адатын калыптандырыңыз.',
      },
      {
        lang: Language.ru,
        title: 'Короткие утренние азкары',
        shortDescription: 'Простые ежедневные формулы поминания утром.',
        description:
          'Небольшой набор азкаров, который можно читать ежедневно за несколько минут.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          {
            lang: Language.ky,
            content: 'Эртең менен тынч жерде 2-3 мүнөт бөлүңүз.',
          },
          {
            lang: Language.ru,
            content: 'Выделите утром 2-3 минуты в спокойном месте.',
          },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          { lang: Language.ky, content: 'Кыска тексттерди аз-аздан жаттаңыз.' },
          {
            lang: Language.ru,
            content: 'Заучивайте короткие тексты постепенно.',
          },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          {
            lang: Language.ky,
            content: 'Сапатка көңүл буруңуз: түшүнүп жана ойлонуп окуңуз.',
          },
          {
            lang: Language.ru,
            content: 'Сосредоточьтесь на осознанном чтении, а не на скорости.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          {
            lang: Language.ky,
            content: 'Күн сайын бирдей убакыт тандап, адат кылыңыз.',
          },
          {
            lang: Language.ru,
            content: 'Читая в одно и то же время, вы легче закрепите привычку.',
          },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Quran',
        title: 'Сура Аль-Ахзаб 33:41 (частое поминание Аллаха)',
        url: 'https://quran.com/33/41',
      },
      {
        sortOrder: 1,
        sourceName: 'Sahih Muslim',
        title: 'Хадисы о достоинстве поминания',
        url: 'https://sunnah.com/muslim',
      },
    ],
  },
  {
    slug: 'dua-before-sleep',
    categorySlug: 'daily-duas',
    status: ContentStatus.published,
    sortOrder: 2,
    isFeatured: false,
    translations: [
      {
        lang: Language.ky,
        title: 'Уктаар алдындагы дуба',
        shortDescription: 'Кечки убакытта окула турган жөнөкөй дубалар.',
        description:
          'Уктаар алдында дуба окуу жүрөктү тынчтандырып, күндү зикир менен жыйынтыктоого жардам берет.',
      },
      {
        lang: Language.ru,
        title: 'Дуа перед сном',
        shortDescription: 'Короткие вечерние дуа перед отходом ко сну.',
        description:
          'Практический набор из нескольких коротких дуа для ежедневного чтения.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          {
            lang: Language.ky,
            content:
              'Уктаар алдында телефонду четке коюп, тынчтануу убактысын бериңиз.',
          },
          {
            lang: Language.ru,
            content: 'Перед сном уберите отвлекающие устройства и успокойтесь.',
          },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          {
            lang: Language.ky,
            content: 'Жеңил зикирден кийин кыска дубаларды окуңуз.',
          },
          {
            lang: Language.ru,
            content: 'После краткого зикра прочитайте дуа перед сном.',
          },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          {
            lang: Language.ky,
            content: 'Тексттерди жай окуп, маанисин ойлонуңуз.',
          },
          {
            lang: Language.ru,
            content: 'Читайте спокойно и вдумчиво, понимая смысл.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          {
            lang: Language.ky,
            content: 'Бул амалды күн сайын кайталап туруңуз.',
          },
          {
            lang: Language.ru,
            content: 'Сделайте эту практику ежедневной привычкой.',
          },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Sahih al-Bukhari',
        title: 'Хадисы о дуа перед сном',
        url: 'https://sunnah.com/bukhari',
      },
      {
        sortOrder: 1,
        sourceName: 'IslamHouse (RU)',
        title: 'Сборники ежедневных дуа',
        url: 'https://islamhouse.com/ru/',
      },
    ],
  },
  {
    slug: 'five-pillars-of-islam',
    categorySlug: 'basic-islamic-knowledge',
    status: ContentStatus.published,
    sortOrder: 1,
    isFeatured: false,
    translations: [
      {
        lang: Language.ky,
        title: 'Исламдын 5 түркүгү',
        shortDescription: 'Исламдагы негизги практикалык түркүктөр.',
        description:
          'Бул сабакта 5 түркүккө кыскача түшүндүрмө жана жаңы баштагандар үчүн окуу тартиби берилет.',
      },
      {
        lang: Language.ru,
        title: 'Пять столпов ислама',
        shortDescription: 'Базовые практические основы религии.',
        description:
          'Краткий обзор пяти столпов и как начать их изучение поэтапно.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          { lang: Language.ky, content: '1) Шахада - ишеним күбөлүгү.' },
          { lang: Language.ru, content: '1) Шахада - свидетельство веры.' },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          { lang: Language.ky, content: '2) Намаз - күнүнө 5 убак намаз.' },
          {
            lang: Language.ru,
            content: '2) Намаз - пять обязательных молитв.',
          },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          { lang: Language.ky, content: '3) Орозо - Рамазан айындагы орозо.' },
          {
            lang: Language.ru,
            content: '3) Пост - соблюдение поста в Рамадан.',
          },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          {
            lang: Language.ky,
            content: '4) Зекет - муктаждарга милдеттүү жардам.',
          },
          {
            lang: Language.ru,
            content: '4) Закят - обязательная помощь нуждающимся.',
          },
        ],
      },
      {
        sortOrder: 4,
        translations: [
          {
            lang: Language.ky,
            content: '5) Ажылык - мүмкүнчүлүгү барлар үчүн.',
          },
          { lang: Language.ru, content: '5) Хадж - для имеющих возможность.' },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Sahih al-Bukhari',
        title: 'Хадис о пяти столпах ислама',
        url: 'https://sunnah.com/bukhari:8',
      },
      {
        sortOrder: 1,
        sourceName: 'Sahih Muslim',
        title: 'Хадис о пяти столпах ислама',
        url: 'https://sunnah.com/muslim:16',
      },
    ],
  },
  {
    slug: 'six-pillars-of-iman',
    categorySlug: 'basic-islamic-knowledge',
    status: ContentStatus.published,
    sortOrder: 2,
    isFeatured: false,
    translations: [
      {
        lang: Language.ky,
        title: 'Ыймандын 6 шарты',
        shortDescription: 'Ыймандын негизги принциптери кыскача.',
        description:
          'Бул сабак 6 шартты жөнөкөй тилде түшүндүрөт жана мындан ары кайсы темадан баштоо керектигин көрсөтөт.',
      },
      {
        lang: Language.ru,
        title: 'Шесть столпов имана',
        shortDescription: 'Основы вероубеждения в кратком формате.',
        description:
          'Урок даёт базовый обзор столпов имана и помогает выстроить дальнейшее обучение.',
      },
    ],
    steps: [
      {
        sortOrder: 0,
        translations: [
          { lang: Language.ky, content: '1) Аллахка ишенүү.' },
          { lang: Language.ru, content: '1) Вера в Аллаха.' },
        ],
      },
      {
        sortOrder: 1,
        translations: [
          { lang: Language.ky, content: '2) Периштелерге ишенүү.' },
          { lang: Language.ru, content: '2) Вера в ангелов.' },
        ],
      },
      {
        sortOrder: 2,
        translations: [
          { lang: Language.ky, content: '3) Китептерге ишенүү.' },
          { lang: Language.ru, content: '3) Вера в Писания.' },
        ],
      },
      {
        sortOrder: 3,
        translations: [
          { lang: Language.ky, content: '4) Пайгамбарларга ишенүү.' },
          { lang: Language.ru, content: '4) Вера в пророков.' },
        ],
      },
      {
        sortOrder: 4,
        translations: [
          { lang: Language.ky, content: '5) Акырет күнүнө ишенүү.' },
          { lang: Language.ru, content: '5) Вера в Судный день.' },
        ],
      },
      {
        sortOrder: 5,
        translations: [
          { lang: Language.ky, content: '6) Тагдырга ишенүү.' },
          { lang: Language.ru, content: '6) Вера в предопределение.' },
        ],
      },
    ],
    references: [
      {
        sortOrder: 0,
        sourceName: 'Sahih Muslim',
        title: 'Хадис Джибриля об имане',
        url: 'https://sunnah.com/muslim:8',
      },
      {
        sortOrder: 1,
        sourceName: 'Quran',
        title: 'Сура Аль-Бакара 2:285',
        url: 'https://quran.com/2/285',
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
  await prisma.lesson.deleteMany({
    where: {
      slug: {
        notIn: lessonsSeed.map((lesson) => lesson.slug),
      },
    },
  });

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

    await prisma.lessonReference.deleteMany({
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

    if (lesson.videoUrl) {
      mediaResources.push({ type: MediaType.video, url: lesson.videoUrl });
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

    if (lesson.references.length > 0) {
      await prisma.lessonReference.createMany({
        data: lesson.references.map((reference) => ({
          lessonId: upserted.id,
          sortOrder: reference.sortOrder,
          sourceName: reference.sourceName,
          title: reference.title,
          url: reference.url,
          verificationNote: reference.verificationNote,
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
