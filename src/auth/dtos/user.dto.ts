import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { AuthDTO } from './auth.dto';

export class CreateUserDTO {
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @ApiProperty()
  readonly name: string;

  @IsDateString({
    message: 'La fecha de nacimiento debe ser una fecha válida',
  })
  @ApiProperty()
  readonly birthdate: Date;

  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty()
  readonly userAuth: AuthDTO;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
