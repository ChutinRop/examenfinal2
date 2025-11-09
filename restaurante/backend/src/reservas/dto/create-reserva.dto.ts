// src/reservas/dto/create-reserva.dto.ts
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateReservaDto {
  @IsNotEmpty()
  @IsDateString() // Valida que sea un string ISO 8601 (ej: "2025-12-01T20:00:00Z")
  fechaHora: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  numeroPersonas: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  clienteId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty() // <-- Corregido
  mesaId: number;
}