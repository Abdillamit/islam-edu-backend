import { Injectable } from '@nestjs/common';
import { Language, Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpsertCategoryTranslationDto } from './dto/upsert-category-translation.dto';

const categoryInclude = {
  translations: true,
} satisfies Prisma.CategoryInclude;

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllPublished() {
    return this.prisma.category.findMany({
      where: {
        status: 'published',
      },
      include: categoryInclude,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  findPublishedById(id: string) {
    return this.prisma.category.findFirst({
      where: {
        id,
        status: 'published',
      },
      include: categoryInclude,
    });
  }

  findAllForAdmin() {
    return this.prisma.category.findMany({
      include: categoryInclude,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: categoryInclude,
    });
  }

  create(dto: CreateCategoryDto, adminId: string) {
    return this.prisma.category.create({
      data: {
        slug: dto.slug,
        iconName: dto.iconName,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? 'draft',
        createdById: adminId,
        updatedById: adminId,
        translations: {
          create: dto.translations.map((translation) => ({
            lang: translation.lang,
            title: translation.title,
            description: translation.description,
          })),
        },
      },
      include: categoryInclude,
    });
  }

  async update(id: string, dto: UpdateCategoryDto, adminId: string) {
    const { translations, ...categoryPayload } = dto;

    return this.prisma.$transaction(async (transactionClient) => {
      await transactionClient.category.update({
        where: { id },
        data: {
          ...categoryPayload,
          updatedById: adminId,
        },
      });

      if (translations) {
        for (const translation of translations) {
          await transactionClient.categoryTranslation.upsert({
            where: {
              categoryId_lang: {
                categoryId: id,
                lang: translation.lang,
              },
            },
            create: {
              categoryId: id,
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

      return transactionClient.category.findUniqueOrThrow({
        where: { id },
        include: categoryInclude,
      });
    });
  }

  async upsertTranslation(
    id: string,
    lang: Language,
    dto: UpsertCategoryTranslationDto,
    adminId: string,
  ) {
    return this.prisma.$transaction(async (transactionClient) => {
      await transactionClient.category.update({
        where: { id },
        data: {
          updatedById: adminId,
        },
      });

      await transactionClient.categoryTranslation.upsert({
        where: {
          categoryId_lang: {
            categoryId: id,
            lang,
          },
        },
        create: {
          categoryId: id,
          lang,
          title: dto.title,
          description: dto.description,
        },
        update: {
          title: dto.title,
          description: dto.description,
        },
      });

      return transactionClient.category.findUniqueOrThrow({
        where: { id },
        include: categoryInclude,
      });
    });
  }

  delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
