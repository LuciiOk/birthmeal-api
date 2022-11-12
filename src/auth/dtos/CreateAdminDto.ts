import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateAdminDTO {
  @ApiProperty({
    description: 'El nombre del administrador',
  })
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @IsEmail({
    message: 'El nombre debe ser un correo electrónico',
  })
  email: string;

  @ApiProperty({
    description: 'La contraseña del administrador',
  })
  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  password: string;

  @ApiProperty({
    description: 'La contraseña del administrador',
  })
  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  confirmPassword: string;
}
