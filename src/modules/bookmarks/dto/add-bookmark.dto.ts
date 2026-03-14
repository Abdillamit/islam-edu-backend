import { IsUUID } from 'class-validator';

export class AddBookmarkDto {
  @IsUUID()
  lessonId: string;
}
