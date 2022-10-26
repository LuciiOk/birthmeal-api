import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class LocationDto extends Document {
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  readonly commune: string;

  @IsString()
  @ApiProperty()
  @IsMongoId()
  readonly company: string;
}
