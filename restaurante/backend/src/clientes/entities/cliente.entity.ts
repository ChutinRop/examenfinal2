// src/clientes/entities/cliente.entity.ts
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'clientes' }) // Nombre de la tabla
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @OneToMany(() => Reserva, (reserva) => reserva.cliente)
  reservas: Reserva[];
}