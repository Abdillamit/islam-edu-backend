import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '@prisma/client';
import { getTotalPages } from '../../common/utils/pagination.util';
import {
  pickTranslation,
  resolveLanguage,
} from '../../common/utils/localization.util';
import { MarkLessonCompletedDto } from './dto/mark-lesson-completed.dto';
import { ProgressQueryDto } from './dto/progress-query.dto';
import { ProgressRepository } from './progress.repository';

type CompletedProgressItem = Awaited<
  ReturnType<ProgressRepository['getCompletedLessons']>
>['items'][number];

type LessonSummary = NonNullable<
  Awaited<ReturnType<ProgressRepository['getNextLesson']>>
>;

@Injectable()
export class ProgressService {
  constructor(private readonly progressRepository: ProgressRepository) {}

  async markLessonCompleted(deviceId: string, dto: MarkLessonCompletedDto) {
    const lesson = await this.progressRepository.lessonExistsPublished(
      dto.lessonId,
    );
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const completed = await this.progressRepository.markCompleted(
      deviceId,
      dto.lessonId,
    );

    return {
      lessonId: completed.lessonId,
      completedAt: completed.completedAt,
    };
  }

  async getCompletedLessons(deviceId: string, query: ProgressQueryDto) {
    const lang = resolveLanguage(query.lang);
    const result = await this.progressRepository.getCompletedLessons(
      deviceId,
      query.page,
      query.limit,
    );

    return {
      items: result.items.map((item) => ({
        lessonId: item.lessonId,
        completedAt: item.completedAt,
        lesson: this.mapLessonSummary(item, lang),
      })),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: getTotalPages(result.total, result.limit),
    };
  }

  async getProgressSummary(deviceId: string, langInput?: string) {
    const lang = resolveLanguage(langInput);
    const [totalPublishedLessons, completedLessons, nextLesson] =
      await Promise.all([
        this.progressRepository.countPublishedLessons(),
        this.progressRepository.countCompletedPublishedLessons(deviceId),
        this.progressRepository.getNextLesson(deviceId),
      ]);

    const completionPercent =
      totalPublishedLessons === 0
        ? 0
        : Math.round((completedLessons / totalPublishedLessons) * 100);

    return {
      totalLessons: totalPublishedLessons,
      completedLessons,
      completionPercent,
      nextLesson: nextLesson
        ? this.mapLessonSummaryFromLesson(nextLesson, lang)
        : null,
    };
  }

  private mapLessonSummary(item: CompletedProgressItem, lang: Language) {
    return this.mapLessonSummaryFromLesson(item.lesson, lang);
  }

  private mapLessonSummaryFromLesson(lesson: LessonSummary, lang: Language) {
    const translation = pickTranslation(lesson.translations, lang);
    const categoryTranslation = pickTranslation(
      lesson.category.translations,
      lang,
    );

    return {
      id: lesson.id,
      categoryId: lesson.categoryId,
      title: translation?.title ?? '',
      shortDescription: translation?.shortDescription ?? '',
      categoryTitle: categoryTranslation?.title ?? '',
      imageUrl: lesson.imageUrl,
      audioUrl: lesson.audioUrl,
    };
  }
}
