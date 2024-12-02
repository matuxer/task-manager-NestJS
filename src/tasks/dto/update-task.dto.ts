import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional({ message: 'El titulo es opcional' })
  @IsString({ message: 'El titulo debe ser una cadena de texto' })
  @MinLength(3, { message: 'El titulo debe tener al menos 3 caracteres' })
  title?: string;

  @IsOptional({ message: 'La descripción es opcional' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @IsOptional({ message: 'El campo completado es opcional' })
  @IsBoolean({
    message: 'El campo completado debe ser un valor booleano (true o false)',
  })
  completed?: boolean;
}
