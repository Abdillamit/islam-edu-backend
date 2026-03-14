import { IsUUID } from 'class-validator';

export class MarkLessonCompletedDto {
  @IsUUID()
  lessonId: string;
}
