import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesQueryDto } from './dto/categories-query.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories(@Query() query: CategoriesQueryDto) {
    return this.categoriesService.getAllPublished(query.lang);
  }

  @Get(':id')
  getCategoryById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: CategoriesQueryDto,
  ) {
    return this.categoriesService.getPublishedById(id, query.lang);
  }
}
