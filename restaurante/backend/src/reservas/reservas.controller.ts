// src/reservas/reservas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto);
  }

  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  // --- ENDPOINTS DE CONSULTAS ESPECIALES ---

  @Get('disponibilidad')
  findDisponibilidad(
    @Query('fecha') fecha: string,
    @Query('personas', ParseIntPipe) personas: number,
  ) {
    if (!fecha || !personas) {
      throw new BadRequestException(
        'Los parámetros "fecha" (ISO string) y "personas" (número) son requeridos',
      );
    }
    return this.reservasService.findDisponibilidad(fecha, personas);
  }

  @Get('dia/:fecha')
  findReservasDelDia(@Param('fecha') fecha: string) {
    // Validar formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new BadRequestException('El formato de fecha debe ser YYYY-MM-DD');
    }
    return this.reservasService.findReservasDelDia(fecha);
  }

  // --- ENDPOINTS CRUD ---

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.findOne(id);
  }

  @Patch(':id/cancelar')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.cancel(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    return this.reservasService.update(id, updateReservaDto);
  }
}