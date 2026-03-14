import { ContentStatus, Language } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LessonTranslationUpdateDto {
  @IsEnum(Language)
  lang: Language;

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

class LessonStepTranslationUpdateDto {
  @IsEnum(Language)
  lang: Language;

  @IsString()
  content: string;
}

class LessonStepUpdateDto {
  @IsInt()
  @Min(0)
  sortOrder: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonStepTranslationUpdateDto)
  translations: LessonStepTranslationUpdateDto[];
}

export class UpdateLessonDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonTranslationUpdateDto)
  translations?: LessonTranslationUpdateDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonStepUpdateDto)
  steps?: LessonStepUpdateDto[];
}
