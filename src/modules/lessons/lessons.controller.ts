import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { LessonListQueryDto } from './dto/lesson-list-query.dto';
import { SearchLessonsQueryDto } from './dto/search-lessons-query.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('featured')
  getFeaturedLessons(@Query('lang') lang?: string) {
    return this.lessonsService.getFeaturedLessons(lang);
  }

  @Get('search')
  searchLessons(@Query() query: SearchLessonsQueryDto) {
    return this.lessonsService.searchLessons(query);
  }

  @Get()
  getLessons(@Query() query: LessonListQueryDto) {
    return this.lessonsService.getPublishedLessons(query);
  }

  @Get(':id')
  getLessonById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('lang') lang?: string,
  ) {
    return this.lessonsService.getPublishedLessonById(id, lang);
  }
}
