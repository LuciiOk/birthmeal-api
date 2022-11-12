import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class GetCordinatesDto {
  @IsString({
    message: 'La dirección debe ser una cadena de texto',
  })
  @ApiProperty({
    description: 'La dirección de la empresa',
  })
  street: string;

  @IsString({
    message: 'La ciudad debe ser una cadena de texto',
  })
  @ApiProperty({
    description: 'La comuna de la empresa, debe ser una comuna Chilena',
  })
  commune: string;

  @IsString({
    message: 'La región debe ser una cadena de texto',
  })
  @IsOptional()
  @ApiProperty({
    description: 'La región de la empresa, debe ser una región Chilena',
  })
  region?: string;
}
