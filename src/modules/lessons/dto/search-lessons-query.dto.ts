import { IsOptional, IsString } from 'class-validator';
import { LessonListQueryDto } from './lesson-list-query.dto';

export class SearchLessonsQueryDto extends LessonListQueryDto {
  @IsOptional()
  @IsString()
  q?: string;
}
