// src/mesas/dto/create-mesa.dto.ts
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateMesaDto {
  @IsInt()
  @IsPositive()
  numero: number;

  @IsInt()
  @Min(1, { message: 'La capacidad debe ser al menos 1' })
  capacidad: number;

  @IsString()
  @IsOptional()
  ubicacion?: string;
}