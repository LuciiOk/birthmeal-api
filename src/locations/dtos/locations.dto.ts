import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, MaxLength } from 'class-validator';


export class GeometryDTO {
  @IsNumber({}, { each: true, message: 'El valor debe ser un número' })
  @MaxLength(2, { message: 'El arreglo debe tener solo 2 valores (latitud y longitud)' })
  @ApiProperty({
    type: [Number],
    description: 'Las coordenadas de la ubicación de la empresa [latitud, longitud]',
  })
  readonly coordinates: number[];
}
export class LocationDto {
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

  @ApiProperty({
    description: 'La comuna de la ubicación',
  })
  @IsString({
    message: 'La comuna debe ser una cadena de texto',
  })
  readonly commune: string;

  @IsObject({
    message: 'La geolocalización debe ser un objeto',
  })
  @ApiProperty({
    description: 'Georeferencia de la empresa',
  })
  readonly geometry: GeometryDTO;
}

export class UpdateLocationDto extends PartialType(LocationDto) {}
