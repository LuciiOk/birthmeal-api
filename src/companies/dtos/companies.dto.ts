import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsObject, IsPositive, IsString, IsUrl } from 'class-validator';
export class CompanyDto {
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsUrl()
  @ApiProperty()
  readonly webUrl: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly rating: number;

  @IsMongoId()
  @ApiProperty()
  readonly category: string;

  @IsObject()
  @ApiProperty()
  locations: any[]
}

export class UpdateCompanyDto extends PartialType(CompanyDto) {}
