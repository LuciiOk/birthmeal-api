import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Por favor, ingrese un correo válido' })
  @IsNotEmpty({
    message: 'Por favor, ingrese un correo',
  })
  @ApiProperty({
    description: 'Correo electrónico',
  })
  email: string;
}

export class VerifyDto {
  @IsNotEmpty({
    message: 'Por favor, ingrese un código',
  })
  @IsNumberString({
    message: 'Por favor, ingrese un código válido',
  })
  @ApiProperty({
    description: 'Código de verificación',
  })
  code: string;

  @IsNotEmpty()
  @ApiProperty()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Por favor, ingrese un correo válido' })
  @ApiProperty({
    description: 'Correo electrónico',
  })
  email: string;

  @IsNotEmpty({
    message: 'Por favor, ingrese una contraseña',
  })
  @ApiProperty({
    description: 'Contraseña',
  })
  readonly password: string;

  @IsNotEmpty({
    message: 'Por favor, ingrese una contraseña',
  })
  @ApiProperty({
    description: 'Confirmar contraseña',
  })
  readonly confirmPassword: string;
}
