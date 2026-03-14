import { ContentStatus, Language } from '@prisma/client';
import {
  ArrayMinSize,
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

export class LessonTranslationInputDto {
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

export class LessonStepTranslationInputDto {
  @IsEnum(Language)
  lang: Language;

  @IsString()
  content: string;
}

export class LessonStepInputDto {
  @IsInt()
  @Min(0)
  sortOrder: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LessonStepTranslationInputDto)
  translations: LessonStepTranslationInputDto[];
}

export class CreateLessonDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  @MaxLength(120)
  slug: string;

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

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LessonTranslationInputDto)
  translations: LessonTranslationInputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonStepInputDto)
  steps?: LessonStepInputDto[];
}
