// src/reservas/entities/reserva.entity.ts
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity({ name: 'reservas' })
@Unique(['mesaId', 'fechaHora']) // Valida que no se repita mesa y hora
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  // --- El error estaba aquí ---
  // El servicio las necesita, pero seguro que faltaban en tu archivo

  @Column({ type: 'timestamp' })
  fechaHora: Date;

  @Column()
  numeroPersonas: number;

  @Column({ default: 'confirmada' })
  estado: string;

  @Column()
  clienteId: number; // <-- Requerido por el .create()

  @Column()
  mesaId: number; // <-- Requerido por el .create() y el .map()

  // --- Fin de la sección de error ---

  // Relación con Cliente
  @ManyToOne(() => Cliente, (cliente) => cliente.reservas, {
    onDelete: 'CASCADE',
    eager: true,
  })
  cliente: Cliente;

  // Relación con Mesa
  @ManyToOne(() => Mesa, (mesa) => mesa.reservas, {
    onDelete: 'CASCADE',
    eager: true,
  })
  mesa: Mesa;
}