import { Injectable } from '@nestjs/common';
import { Language, MediaType, Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { normalizePagination } from '../../common/utils/pagination.util';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonListQueryDto } from './dto/lesson-list-query.dto';
import { SearchLessonsQueryDto } from './dto/search-lessons-query.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UpsertLessonTranslationDto } from './dto/upsert-lesson-translation.dto';

const lessonListInclude = {
  translations: true,
  category: {
    include: {
      translations: true,
    },
  },
} satisfies Prisma.LessonInclude;

const lessonDetailInclude = {
  translations: true,
  category: {
    include: {
      translations: true,
    },
  },
  steps: {
    include: {
      translations: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  },
  mediaResources: true,
} satisfies Prisma.LessonInclude;

@Injectable()
export class LessonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPublishedPaginated(query: LessonListQueryDto) {
    const pagination = normalizePagination(query.page, query.limit);
    const where: Prisma.LessonWhereInput = {
      status: 'published',
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lesson.findMany({
        where,
        include: lessonListInclude,
        orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      items,
      total,
      ...pagination,
    };
  }

  findFeatured(limit = 6) {
    return this.prisma.lesson.findMany({
      where: {
        status: 'published',
        isFeatured: true,
      },
      include: lessonListInclude,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: limit,
    });
  }

  async searchPublished(query: SearchLessonsQueryDto) {
    const pagination = normalizePagination(query.page, query.limit);
    const q = query.q?.trim();

    if (!q) {
      return {
        items: [],
        total: 0,
        ...pagination,
      };
    }

    const where: Prisma.LessonWhereInput = {
      status: 'published',
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      translations: {
        some: {
          OR: [
            {
              title: {
                contains: q,
                mode: 'insensitive',
              },
            },
            {
              shortDescription: {
                contains: q,
                mode: 'insensitive',
              },
            },
          ],
        },
      },
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lesson.findMany({
        where,
        include: lessonListInclude,
        orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      items,
      total,
      ...pagination,
    };
  }

  findPublishedById(id: string) {
    return this.prisma.lesson.findFirst({
      where: {
        id,
        status: 'published',
      },
      include: lessonDetailInclude,
    });
  }

  findById(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: lessonDetailInclude,
    });
  }

  async findForAdminPaginated(page = 1, limit = 20) {
    const pagination = normalizePagination(page, limit);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lesson.findMany({
        include: lessonDetailInclude,
        orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
      this.prisma.lesson.count(),
    ]);

    return {
      items,
      total,
      ...pagination,
    };
  }

  create(dto: CreateLessonDto, adminId: string) {
    const mediaData = this.mapMediaResources(dto.imageUrl, dto.audioUrl);

    return this.prisma.lesson.create({
      data: {
        categoryId: dto.categoryId,
        slug: dto.slug,
        status: dto.status ?? 'draft',
        isFeatured: dto.isFeatured ?? false,
        sortOrder: dto.sortOrder ?? 0,
        imageUrl: dto.imageUrl,
        audioUrl: dto.audioUrl,
        createdById: adminId,
        updatedById: adminId,
        translations: {
          create: dto.translations.map((translation) => ({
            lang: translation.lang,
            title: translation.title,
            shortDescription: translation.shortDescription,
            description: translation.description,
          })),
        },
        steps: dto.steps
          ? {
              create: dto.steps.map((step) => ({
                sortOrder: step.sortOrder,
                translations: {
                  create: step.translations.map((translation) => ({
                    lang: translation.lang,
                    content: translation.content,
                  })),
                },
              })),
            }
          : undefined,
        mediaResources:
          mediaData.length > 0
            ? {
                create: mediaData,
              }
            : undefined,
      },
      include: lessonDetailInclude,
    });
  }

  async update(id: string, dto: UpdateLessonDto, adminId: string) {
    const { translations, steps, ...lessonPayload } = dto;
    const mediaPayloadProvided =
      dto.imageUrl !== undefined || dto.audioUrl !== undefined;

    return this.prisma.$transaction(async (transactionClient) => {
      await transactionClient.lesson.update({
        where: { id },
        data: {
          ...lessonPayload,
          updatedById: adminId,
        },
      });

      if (translations) {
        for (const translation of translations) {
          await transactionClient.lessonTranslation.upsert({
            where: {
              lessonId_lang: {
                lessonId: id,
                lang: translation.lang,
              },
            },
            create: {
              lessonId: id,
              lang: translation.lang,
              title: translation.title,
              shortDescription: translation.shortDescription,
              description: translation.description,
            },
            update: {
              title: translation.title,
              shortDescription: translation.shortDescription,
              description: translation.description,
            },
          });
        }
      }

      if (steps) {
        await transactionClient.lessonStep.deleteMany({
          where: { lessonId: id },
        });

        for (const step of steps) {
          const createdStep = await transactionClient.lessonStep.create({
            data: {
              lessonId: id,
              sortOrder: step.sortOrder,
            },
          });

          for (const translation of step.translations) {
            await transactionClient.lessonStepTranslation.create({
              data: {
                stepId: createdStep.id,
                lang: translation.lang,
                content: translation.content,
              },
            });
          }
        }
      }

      if (mediaPayloadProvided) {
        const currentLesson = await transactionClient.lesson.findUniqueOrThrow({
          where: { id },
          select: {
            imageUrl: true,
            audioUrl: true,
          },
        });

        await transactionClient.mediaResource.deleteMany({
          where: { lessonId: id },
        });

        const mediaData = this.mapMediaResources(
          currentLesson.imageUrl ?? undefined,
          currentLesson.audioUrl ?? undefined,
        );

        if (mediaData.length > 0) {
          await transactionClient.mediaResource.createMany({
            data: mediaData.map((resource) => ({
              lessonId: id,
              type: resource.type,
              url: resource.url,
            })),
          });
        }
      }

      return transactionClient.lesson.findUniqueOrThrow({
        where: { id },
        include: lessonDetailInclude,
      });
    });
  }

  async upsertTranslation(
    id: string,
    lang: Language,
    dto: UpsertLessonTranslationDto,
    adminId: string,
  ) {
    return this.prisma.$transaction(async (transactionClient) => {
      await transactionClient.lesson.update({
        where: { id },
        data: {
          updatedById: adminId,
        },
      });

      await transactionClient.lessonTranslation.upsert({
        where: {
          lessonId_lang: {
            lessonId: id,
            lang,
          },
        },
        create: {
          lessonId: id,
          lang,
          title: dto.title,
          shortDescription: dto.shortDescription,
          description: dto.description,
        },
        update: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          description: dto.description,
        },
      });

      return transactionClient.lesson.findUniqueOrThrow({
        where: { id },
        include: lessonDetailInclude,
      });
    });
  }

  delete(id: string) {
    return this.prisma.lesson.delete({
      where: { id },
    });
  }

  categoryExists(categoryId: string) {
    return this.prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
      },
    });
  }

  private mapMediaResources(imageUrl?: string, audioUrl?: string) {
    const mediaResources: Array<{ type: MediaType; url: string }> = [];

    if (imageUrl) {
      mediaResources.push({
        type: MediaType.image,
        url: imageUrl,
      });
    }

    if (audioUrl) {
      mediaResources.push({
        type: MediaType.audio,
        url: audioUrl,
      });
    }

    return mediaResources;
  }
}
