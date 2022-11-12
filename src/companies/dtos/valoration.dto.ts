import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min, Max } from 'class-validator';


export class CreateValorationDto {
  // VALIDATE THAT VALUES IS BETWEEN 1 AND 5
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 0,
    },
    {
      message: 'La calificación debe ser un número entero',
    },
  )
  @Min(1, {
    message: 'La calificación debe ser un número entero entre 1 y 5',
  })
  @Max(5, {
    message: 'La calificación debe ser un número entero entre 1 y 5',
  })
  @IsPositive({
    message: 'La calificación debe ser un número entero entre 1 y 5',
  })
  @ApiProperty({
    description: 'Puntuación de la empresa',
    example: 5,
  })
  valoration: number;
}

export class UpdateValorationDto extends PartialType(CreateValorationDto) {}
