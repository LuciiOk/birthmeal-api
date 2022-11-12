import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsObject, IsString } from 'class-validator';

export class LocationDto extends Document {
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @ApiProperty({
    description: 'El nombre de la ubicación de la empresa',
  })
  readonly name: string;

  @IsString({
    message: 'La dirección debe ser una cadena de texto',
  })
  @ApiProperty({
    description: 'La dirección de la empresa',
  })
  readonly address: string;

  @IsString({
    message:
      'ID de la empresa debe ser una cadena de texto, provista por Google Maps',
  })
  @ApiProperty({
    description: 'ID de la ubicación, proveida por Google Maps',
  })
  readonly placeId: string;

  @IsObject({
    message: 'La geolocalización debe ser un objeto',
  })
  @ApiProperty({
    description: 'Georeferencia de la empresa',
  })
  readonly geometry: GeometryDTO;
}

export class GeometryDTO extends Document {
  @IsArray({
    message: 'Las coordenadas deben ser un arreglo',
  })
  @ApiProperty({
    description: 'Las coordenadas de la ubicación de la empresa',
  })
  readonly coordinates: number[];
}

export class UpdateLocationDto extends PartialType(LocationDto) {}
