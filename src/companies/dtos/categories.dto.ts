import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString } from 'class-validator';
export class CategoryDto {
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  readonly icon: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  readonly color: string;
}

export class UpdateCategoryDto extends PartialType(CategoryDto) {}
