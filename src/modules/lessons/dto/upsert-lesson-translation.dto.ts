import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpsertLessonTranslationDto {
  @IsString()
  @MaxLength(140)
  title: string;

  @IsString()
  @MaxLength(240)
  shortDescription: string;

  @IsOptional()
  @IsString()
  description?: string;
}
