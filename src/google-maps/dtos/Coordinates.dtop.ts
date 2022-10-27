import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetCordinatesDto {
  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  commune: string;

  @IsString()
  @ApiProperty()
  region: string;
}
