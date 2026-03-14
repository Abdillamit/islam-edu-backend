import { Injectable, NotFoundException } from '@nestjs/common';
import { Language, MediaType } from '@prisma/client';
import { getTotalPages } from '../../common/utils/pagination.util';
import {
  pickTranslation,
  resolveLanguage,
} from '../../common/utils/localization.util';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonListQueryDto } from './dto/lesson-list-query.dto';
import { SearchLessonsQueryDto } from './dto/search-lessons-query.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UpsertLessonTranslationDto } from './dto/upsert-lesson-translation.dto';
import { LessonsRepository } from './lessons.repository';

type LessonListItem = Awaited<
  ReturnType<LessonsRepository['findPublishedPaginated']>
>['items'][number];

type LessonDetailItem = NonNullable<
  Awaited<ReturnType<LessonsRepository['findById']>>
>;

@Injectable()
export class LessonsService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async getPublishedLessons(query: LessonListQueryDto) {
    const lang = resolveLanguage(query.lang);
    const result = await this.lessonsRepository.findPublishedPaginated(query);

    return {
      items: result.items.map((lesson) => this.toLessonSummary(lesson, lang)),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: getTotalPages(result.total, result.limit),
    };
  }

  async getFeaturedLessons(langInput?: string) {
    const lang = resolveLanguage(langInput);
    const lessons = await this.lessonsRepository.findFeatured();
    return lessons.map((lesson) => this.toLessonSummary(lesson, lang));
  }

  async searchLessons(query: SearchLessonsQueryDto) {
    const lang = resolveLanguage(query.lang);
    const result = await this.lessonsRepository.searchPublished(query);

    return {
      items: result.items.map((lesson) => this.toLessonSummary(lesson, lang)),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: getTotalPages(result.total, result.limit),
    };
  }

  async getPublishedLessonById(id: string, langInput?: string) {
    const lang = resolveLanguage(langInput);
    const lesson = await this.lessonsRepository.findPublishedById(id);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.toLessonDetail(lesson, lang);
  }

  async getLessonsForAdmin(page?: number, limit?: number) {
    const result = await this.lessonsRepository.findForAdminPaginated(
      page,
      limit,
    );

    return {
      items: result.items,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: getTotalPages(result.total, result.limit),
    };
  }

  async getLessonForAdmin(id: string) {
    const lesson = await this.lessonsRepository.findById(id);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async create(dto: CreateLessonDto, adminId: string) {
    await this.ensureCategoryExists(dto.categoryId);
    return this.lessonsRepository.create(dto, adminId);
  }

  async update(id: string, dto: UpdateLessonDto, adminId: string) {
    await this.ensureLessonExists(id);

    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    return this.lessonsRepository.update(id, dto, adminId);
  }

  async upsertTranslation(
    id: string,
    lang: Language,
    dto: UpsertLessonTranslationDto,
    adminId: string,
  ) {
    await this.ensureLessonExists(id);
    return this.lessonsRepository.upsertTranslation(id, lang, dto, adminId);
  }

  async delete(id: string) {
    await this.ensureLessonExists(id);
    await this.lessonsRepository.delete(id);

    return {
      deleted: true,
    };
  }

  private async ensureLessonExists(id: string) {
    const lesson = await this.lessonsRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.lessonsRepository.categoryExists(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private toLessonSummary(lesson: LessonListItem, lang: Language) {
    const translation = pickTranslation(lesson.translations, lang);
    const categoryTranslation = pickTranslation(
      lesson.category.translations,
      lang,
    );

    return {
      id: lesson.id,
      categoryId: lesson.categoryId,
      slug: lesson.slug,
      isFeatured: lesson.isFeatured,
      sortOrder: lesson.sortOrder,
      imageUrl: lesson.imageUrl,
      audioUrl: lesson.audioUrl,
      title: translation?.title ?? '',
      shortDescription: translation?.shortDescription ?? '',
      categoryTitle: categoryTranslation?.title ?? '',
    };
  }

  private toLessonDetail(lesson: LessonDetailItem, lang: Language) {
    const translation = pickTranslation(lesson.translations, lang);
    const categoryTranslation = pickTranslation(
      lesson.category.translations,
      lang,
    );

    return {
      id: lesson.id,
      categoryId: lesson.categoryId,
      slug: lesson.slug,
      isFeatured: lesson.isFeatured,
      sortOrder: lesson.sortOrder,
      imageUrl: lesson.imageUrl,
      audioUrl: lesson.audioUrl,
      title: translation?.title ?? '',
      shortDescription: translation?.shortDescription ?? '',
      description: translation?.description ?? '',
      categoryTitle: categoryTranslation?.title ?? '',
      steps: lesson.steps.map((step) => {
        const stepTranslation = pickTranslation(step.translations, lang);
        return {
          id: step.id,
          sortOrder: step.sortOrder,
          content: stepTranslation?.content ?? '',
        };
      }),
      videoResources: lesson.mediaResources
        .filter((resource) => resource.type === MediaType.video)
        .map((resource) => ({
          id: resource.id,
          url: resource.url,
        })),
      references: lesson.references.map((reference) => ({
        id: reference.id,
        sourceName: reference.sourceName,
        title: reference.title,
        url: reference.url,
        verificationNote: reference.verificationNote ?? '',
        sortOrder: reference.sortOrder,
      })),
      mediaResources: lesson.mediaResources,
    };
  }
}
