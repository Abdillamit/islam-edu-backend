import { ContentStatus, Language } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryTranslationInputDto {
  @IsEnum(Language)
  lang: Language;

  @IsString()
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class CreateCategoryDto {
  @IsString()
  @MaxLength(80)
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  iconName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationInputDto)
  translations: CategoryTranslationInputDto[];
}
