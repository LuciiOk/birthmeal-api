import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class BirthdateDto {
  @ApiProperty({
    description: 'El nombre del cumpleañero',
  })
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  name: string;

  @ApiProperty({
    type: Date,
    description: 'La fecha de nacimiento',
  })
  @IsDate({
    message: 'La fecha de nacimiento debe ser una fecha válida',
  })
  birthdate: Date;

  @ApiProperty({
    description: 'Si el usuario desea recibir notificaciones',
  })
  @IsBoolean({
    message: 'El valor de la propiedad "remind" debe ser un booleano',
  })
  remind: boolean;

  @ApiProperty({
    description: 'El ID de la notificación',
  })
  @IsString({
    message: 'El ID del la notificación de expo debe ser una cadena de texto',
  })
  @IsOptional()
  notificationId: string;
}

export class UpdateBirthdateDto extends PartialType(BirthdateDto) {}
