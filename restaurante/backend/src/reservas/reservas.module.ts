// src/reservas/reservas.module.ts
import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { MesasModule } from '../mesas/mesas.module'; // <-- Importar Módulo
import { ClientesModule } from '../clientes/clientes.module'; // <-- Importar Módulo
import { Mesa } from '../mesas/entities/mesa.entity'; // <-- Importar Entidad

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, Mesa]), // <-- Añadir Mesa
    MesasModule, // Importa para acceder a MesasService
    ClientesModule, // Importa para acceder a ClientesService
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}