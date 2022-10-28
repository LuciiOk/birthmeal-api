import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetCordinatesDto {
  @IsString()
  @ApiProperty()
  street: string;

  @IsString()
  @ApiProperty()
  commune: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  region?: string;
}
