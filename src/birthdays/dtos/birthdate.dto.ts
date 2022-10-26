import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsPositive, IsString } from 'class-validator';

export class BirthdateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  birthdate: number;

  @ApiProperty()
  @IsBoolean()
  remind: boolean;
}

export class UpdateBirthdateDto extends PartialType(BirthdateDto) {}
