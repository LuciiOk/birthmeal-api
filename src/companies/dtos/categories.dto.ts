import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString } from 'class-validator';
export class CategoryDto {
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @ApiProperty({
    description: 'El nombre de la categoría',
  })
  readonly name: string;

  @IsString({
    message: 'El icono debe ser una cadena de texto',
  })
  @ApiProperty({
    description: 'El icono de la categoría',
  })
  readonly icon: string;

  @ApiProperty({
    description: 'El color de la categoría',
  })
  @IsHexColor({
    message: 'El color debe ser un código hexadecimal válido',
  })
  readonly color: string;
}

export class UpdateCategoryDto extends PartialType(CategoryDto) {}
