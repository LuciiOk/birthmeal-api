import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
export class CompanyDto {
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsArray()
  @ApiProperty()
  readonly benefits: string[];

  @IsUrl()
  @ApiProperty()
  readonly webUrl: string;

  @IsUrl()
  @ApiProperty()
  readonly imageUrl: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly rating: number;

  @IsMongoId()
  @ApiProperty()
  readonly category: string;

  @IsObject()
  @ApiProperty()
  locations: any[];
}

export class UpdateCompanyDto extends PartialType(CompanyDto) {}
