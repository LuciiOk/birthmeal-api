import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { LocationDto } from 'src/locations/dtos/locations.dto';
export class CompanyDto {
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @ApiProperty({
    description: 'El nombre de la empresa',
  })
  readonly name: string;

  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @ApiProperty({
    description: 'La descripción del beneficio que ofrece la empresa',
  })
  readonly description: string;

  @IsArray({
    message: 'El campo "categories" debe ser un arreglo',
  })
  @ApiProperty({
    type: [String],
    description: 'Arreglo de las restricciones para optar al beneficio',
  })
  readonly benefits: string[];

  @IsUrl({
    require_protocol: true,
    message: 'La URL de la imagen debe ser válida',
  })
  @ApiProperty({
    description: 'La URL del sitio web de la empresa',
  })
  readonly webUrl: string;

  @IsUrl({
    require_protocol: true,
    message: 'El logo debe ser una URL válida',
  })
  @ApiProperty({
    description: 'La URL del logo de la empresa',
  })
  readonly imageUrl: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  @IsOptional()
  readonly rating: number;

  @IsMongoId({
    message: 'El ID de la categoría debe ser un ID de Mongo válido',
  })
  @ApiProperty({
    description: 'El ID de la categoría',
  })
  readonly category: string;

  @IsArray({
    message: 'El campo de las ubicaciones debe ser un arreglo',
  })
  @ApiProperty({
    type: [Object],
    description: 'Arreglo de las ubicaciones de la empresa',
  })
  locations: LocationDto[];
}

export class UpdateCompanyDto extends PartialType(CompanyDto) {}
