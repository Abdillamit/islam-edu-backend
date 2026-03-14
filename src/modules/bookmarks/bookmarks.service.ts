import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '@prisma/client';
import { getTotalPages } from '../../common/utils/pagination.util';
import {
  pickTranslation,
  resolveLanguage,
} from '../../common/utils/localization.util';
import { AddBookmarkDto } from './dto/add-bookmark.dto';
import { BookmarkQueryDto } from './dto/bookmark-query.dto';
import { BookmarksRepository } from './bookmarks.repository';

type BookmarkItem = Awaited<
  ReturnType<BookmarksRepository['findByDevice']>
>['items'][number];

@Injectable()
export class BookmarksService {
  constructor(private readonly bookmarksRepository: BookmarksRepository) {}

  async getBookmarks(deviceId: string, query: BookmarkQueryDto) {
    const lang = resolveLanguage(query.lang);
    const result = await this.bookmarksRepository.findByDevice(
      deviceId,
      query.page,
      query.limit,
    );

    return {
      items: result.items.map((bookmark) =>
        this.toBookmarkSummary(bookmark, lang),
      ),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: getTotalPages(result.total, result.limit),
    };
  }

  async addBookmark(deviceId: string, dto: AddBookmarkDto) {
    const lesson = await this.bookmarksRepository.lessonExistsPublished(
      dto.lessonId,
    );
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const bookmark = await this.bookmarksRepository.addBookmark(
      deviceId,
      dto.lessonId,
    );

    return {
      id: bookmark.id,
      lessonId: bookmark.lessonId,
      createdAt: bookmark.createdAt,
    };
  }

  async removeBookmark(deviceId: string, lessonId: string) {
    await this.bookmarksRepository.removeBookmark(deviceId, lessonId);
    return {
      deleted: true,
    };
  }

  private toBookmarkSummary(bookmark: BookmarkItem, lang: Language) {
    const translation = pickTranslation(bookmark.lesson.translations, lang);
    const categoryTranslation = pickTranslation(
      bookmark.lesson.category.translations,
      lang,
    );

    return {
      id: bookmark.id,
      lessonId: bookmark.lessonId,
      createdAt: bookmark.createdAt,
      lesson: {
        id: bookmark.lesson.id,
        categoryId: bookmark.lesson.categoryId,
        title: translation?.title ?? '',
        shortDescription: translation?.shortDescription ?? '',
        categoryTitle: categoryTranslation?.title ?? '',
        imageUrl: bookmark.lesson.imageUrl,
        audioUrl: bookmark.lesson.audioUrl,
      },
    };
  }
}
