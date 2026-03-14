import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Language } from '@prisma/client';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { AdminJwtAuthGuard } from '../../common/guards/admin-jwt-auth.guard';
import { AuthenticatedAdmin } from '../../common/interfaces/authenticated-admin.interface';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpsertCategoryTranslationDto } from './dto/upsert-category-translation.dto';

@UseGuards(AdminJwtAuthGuard)
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategoriesForAdmin() {
    return this.categoriesService.getAllForAdmin();
  }

  @Get(':id')
  getCategoryForAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.getByIdForAdmin(id);
  }

  @Post()
  createCategory(
    @Body() dto: CreateCategoryDto,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.categoriesService.create(dto, admin.id);
  }

  @Patch(':id')
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.categoriesService.update(id, dto, admin.id);
  }

  @Put(':id/translations/:lang')
  upsertCategoryTranslation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('lang', new ParseEnumPipe(Language)) lang: Language,
    @Body() dto: UpsertCategoryTranslationDto,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.categoriesService.upsertTranslation(id, lang, dto, admin.id);
  }

  @Delete(':id')
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.delete(id);
  }
}
