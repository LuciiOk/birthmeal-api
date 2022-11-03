import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

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

  @ApiProperty()
  @IsString()
  @IsOptional()
  notificationId: string;
}

export class UpdateBirthdateDto extends PartialType(BirthdateDto) {}
