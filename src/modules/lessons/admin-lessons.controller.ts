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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Language } from '@prisma/client';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { AdminJwtAuthGuard } from '../../common/guards/admin-jwt-auth.guard';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import type { AuthenticatedAdmin } from '../../common/interfaces/authenticated-admin.interface';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UpsertLessonTranslationDto } from './dto/upsert-lesson-translation.dto';
import { LessonsService } from './lessons.service';

@UseGuards(AdminJwtAuthGuard)
@Controller('admin/lessons')
export class AdminLessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  getLessonsForAdmin(@Query() query: PaginationQueryDto) {
    return this.lessonsService.getLessonsForAdmin(query.page, query.limit);
  }

  @Get(':id')
  getLessonForAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.getLessonForAdmin(id);
  }

  @Post()
  createLesson(
    @Body() dto: CreateLessonDto,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.lessonsService.create(dto, admin.id);
  }

  @Patch(':id')
  updateLesson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLessonDto,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.lessonsService.update(id, dto, admin.id);
  }

  @Put(':id/translations/:lang')
  upsertLessonTranslation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('lang', new ParseEnumPipe(Language)) lang: Language,
    @Body() dto: UpsertLessonTranslationDto,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.lessonsService.upsertTranslation(id, lang, dto, admin.id);
  }

  @Delete(':id')
  deleteLesson(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.delete(id);
  }
}
