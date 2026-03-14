import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { normalizePagination } from '../../common/utils/pagination.util';

const lessonSummaryInclude = {
  translations: true,
  category: {
    include: {
      translations: true,
    },
  },
} satisfies Prisma.LessonInclude;

@Injectable()
export class ProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  lessonExistsPublished(lessonId: string) {
    return this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        status: 'published',
      },
      select: {
        id: true,
      },
    });
  }

  markCompleted(deviceId: string, lessonId: string) {
    return this.prisma.userProgress.upsert({
      where: {
        deviceId_lessonId: {
          deviceId,
          lessonId,
        },
      },
      create: {
        deviceId,
        lessonId,
        completedAt: new Date(),
      },
      update: {
        completedAt: new Date(),
      },
      include: {
        lesson: {
          include: lessonSummaryInclude,
        },
      },
    });
  }

  async getCompletedLessons(deviceId: string, page = 1, limit = 20) {
    const pagination = normalizePagination(page, limit);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.userProgress.findMany({
        where: {
          deviceId,
          lesson: {
            status: 'published',
          },
        },
        include: {
          lesson: {
            include: lessonSummaryInclude,
          },
        },
        orderBy: [{ completedAt: 'desc' }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
      this.prisma.userProgress.count({
        where: {
          deviceId,
          lesson: {
            status: 'published',
          },
        },
      }),
    ]);

    return {
      items,
      total,
      ...pagination,
    };
  }

  countPublishedLessons() {
    return this.prisma.lesson.count({
      where: {
        status: 'published',
      },
    });
  }

  countCompletedPublishedLessons(deviceId: string) {
    return this.prisma.userProgress.count({
      where: {
        deviceId,
        lesson: {
          status: 'published',
        },
      },
    });
  }

  getNextLesson(deviceId: string) {
    return this.prisma.lesson.findFirst({
      where: {
        status: 'published',
        progresses: {
          none: {
            deviceId,
          },
        },
      },
      include: lessonSummaryInclude,
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    });
  }
}
