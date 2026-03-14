import { IsOptional, IsString } from 'class-validator';

export class CategoriesQueryDto {
  @IsOptional()
  @IsString()
  lang?: string;
}
