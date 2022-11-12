import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateValorationDto {

  // VALIDATE THAT VALUES IS BETWEEN 1 AND 5
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Puntuación de la empresa',
    example: 5,
  })
  valoration: number;
}

export class UpdateValorationDto extends PartialType(CreateValorationDto) {}
