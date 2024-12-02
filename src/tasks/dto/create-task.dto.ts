import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'El titulo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El titulo no puede estar vacío' })
  @MinLength(3, { message: 'El titulo debe tener al menos 3 caracteres' })
  title: string;

  @IsOptional({ message: 'La descripción es opcional' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @IsOptional({ message: 'El campo completado es opcional' })
  @IsBoolean({
    message: 'El campo completado debe ser un valor booleano (true o false)',
  })
  completed?: boolean;

  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del usuario no puede estar vacío' })
  userId: string;
}
