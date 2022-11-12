import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsString } from 'class-validator';

export class AuthDTO {
  @ApiProperty()
  @IsString({
    message: 'El nombre de usuario debe ser una cadena de texto',
  })
  @IsEmail('El nombre de usuario debe ser un correo electrónico válido')
  email: string;

  @ApiProperty()
  @IsString({
    message: 'La contraseña debe ser un texto',
  })
  password: string;

  @ApiProperty()
  @IsString({ message: 'La contraseña debe ser un texto' })
  confirmPassword: string;

  @ApiProperty()
  @IsMongoId({
    message: 'El ID del usuario debe ser un ID de MongoDB válido',
  })
  @IsString()
  user: string;
}

export class LoginDTO {
  @ApiProperty()
  @IsString({
    message: 'El email de usuario debe ser una cadena de texto',
  })
  @IsEmail('El email de usuario debe ser un correo electrónico válido')
  email: string;

  @ApiProperty()
  @IsString({
    message: 'La contraseña debe ser un texto',
  })
  password: string;
}

export class UpdateAuthDTO extends PartialType(AuthDTO) {}
