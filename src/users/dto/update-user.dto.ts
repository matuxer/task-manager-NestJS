import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional({ message: 'El nombre es opcional' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name?: string;

  @IsOptional({ message: 'El email es opcional' })
  @IsEmail({}, { message: 'El correo debe ser una dirección válida' })
  email?: string;

  @IsOptional({ message: 'La contraseña es opcional' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(32, { message: 'La contraseña no debe superar los 32 caracteres' })
  password?: string;
}
