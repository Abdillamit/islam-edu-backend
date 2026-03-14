import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '@prisma/client';
import {
  pickTranslation,
  resolveLanguage,
} from '../../common/utils/localization.util';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpsertCategoryTranslationDto } from './dto/upsert-category-translation.dto';

type CategoryWithTranslations = Awaited<
  ReturnType<CategoriesRepository['findAllPublished']>
>[number];

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getAllPublished(langInput?: string) {
    const lang = resolveLanguage(langInput);
    const categories = await this.categoriesRepository.findAllPublished();
    return categories.map((category) => this.toPublicCategory(category, lang));
  }

  async getPublishedById(id: string, langInput?: string) {
    const lang = resolveLanguage(langInput);
    const category = await this.categoriesRepository.findPublishedById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.toPublicCategory(category, lang);
  }

  async getAllForAdmin() {
    const categories = await this.categoriesRepository.findAllForAdmin();
    return categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      iconName: category.iconName,
      sortOrder: category.sortOrder,
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      translations: category.translations,
    }));
  }

  async getByIdForAdmin(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      id: category.id,
      slug: category.slug,
      iconName: category.iconName,
      sortOrder: category.sortOrder,
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      translations: category.translations,
    };
  }

  create(dto: CreateCategoryDto, adminId: string) {
    return this.categoriesRepository.create(dto, adminId);
  }

  async update(id: string, dto: UpdateCategoryDto, adminId: string) {
    await this.ensureCategoryExists(id);
    return this.categoriesRepository.update(id, dto, adminId);
  }

  async upsertTranslation(
    id: string,
    lang: Language,
    dto: UpsertCategoryTranslationDto,
    adminId: string,
  ) {
    await this.ensureCategoryExists(id);
    return this.categoriesRepository.upsertTranslation(id, lang, dto, adminId);
  }

  async delete(id: string) {
    await this.ensureCategoryExists(id);
    await this.categoriesRepository.delete(id);

    return {
      deleted: true,
    };
  }

  private async ensureCategoryExists(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private toPublicCategory(category: CategoryWithTranslations, lang: Language) {
    const translation = pickTranslation(category.translations, lang);

    return {
      id: category.id,
      slug: category.slug,
      iconName: category.iconName,
      sortOrder: category.sortOrder,
      title: translation?.title ?? '',
      description: translation?.description ?? null,
    };
  }
}
