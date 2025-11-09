// src/mesas/entities/mesa.entity.ts
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'mesas' })
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: number;

  @Column()
  capacidad: number;

  @Column({ nullable: true })
  ubicacion: string;

  @OneToMany(() => Reserva, (reserva) => reserva.mesa)
  reservas: Reserva[];
}