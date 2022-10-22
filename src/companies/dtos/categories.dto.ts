import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CategoryDto {
  @IsString()
  @ApiProperty()
  readonly Category_name: string;
}

export class UpdateCategoryDto extends PartialType(CategoryDto) {}
