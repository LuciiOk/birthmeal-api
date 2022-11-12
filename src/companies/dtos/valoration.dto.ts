import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateValorationDto {
  @ApiProperty()
  valoration: number;
}

export class UpdateValorationDto extends PartialType(CreateValorationDto) {}
