import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, IsUrl } from 'class-validator';
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
}

export class UpdateCompanyDto extends PartialType(CompanyDto) {}
