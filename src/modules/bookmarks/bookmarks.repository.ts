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
export class BookmarksRepository {
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

  addBookmark(deviceId: string, lessonId: string) {
    return this.prisma.bookmark.upsert({
      where: {
        deviceId_lessonId: {
          deviceId,
          lessonId,
        },
      },
      create: {
        deviceId,
        lessonId,
      },
      update: {},
      include: {
        lesson: {
          include: lessonSummaryInclude,
        },
      },
    });
  }

  removeBookmark(deviceId: string, lessonId: string) {
    return this.prisma.bookmark.deleteMany({
      where: {
        deviceId,
        lessonId,
      },
    });
  }

  async findByDevice(deviceId: string, page = 1, limit = 20) {
    const pagination = normalizePagination(page, limit);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.bookmark.findMany({
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
        orderBy: [{ createdAt: 'desc' }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
      this.prisma.bookmark.count({
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
}
