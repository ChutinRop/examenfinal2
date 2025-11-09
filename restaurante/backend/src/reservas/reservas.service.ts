// src/reservas/reservas.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Between, Repository, MoreThanOrEqual } from 'typeorm';
import { MesasService } from '../mesas/mesas.service';
import { ClientesService } from '../clientes/clientes.service';
import { Mesa } from '../mesas/entities/mesa.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,

    // Inyectamos el repositorio de Mesas para la consulta de disponibilidad
    @InjectRepository(Mesa)
    private mesaRepository: Repository<Mesa>,

    // Inyectamos los servicios de Mesas y Clientes
    private readonly mesasService: MesasService,
    private readonly clientesService: ClientesService,
  ) {}

  async create(createReservaDto: CreateReservaDto) {
    const { fechaHora, numeroPersonas, clienteId, mesaId } = createReservaDto;

    // --- Validación 1: Validar que la mesa y cliente existan ---
    const mesa = await this.mesasService.findOne(mesaId);
    const cliente = await this.clientesService.findOneSimple(clienteId);

    // --- Validación 2: Validar capacidad de mesa vs número de personas ---
    if (numeroPersonas > mesa.capacidad) {
      throw new BadRequestException(
        `El número de personas (${numeroPersonas}) excede la capacidad de la mesa (${mesa.capacidad})`,
      );
    }

    // --- Validación 3: Bloquear reservas en horarios no laborables ---
    const fecha = new Date(fechaHora);
    const hora = fecha.getUTCHours(); // Asumiendo UTC
    // Ejemplo: Horario laboral de 9:00 a 22:00 (última reserva a las 21:59)
    if (hora < 9 || hora >= 22) {
      throw new BadRequestException(
        'La reserva está fuera del horario laboral (9:00 - 22:00)',
      );
    }

    // --- Validación 4: No permitir doble reserva (la entidad @Unique ya ayuda) ---
    try {
      const nuevaReserva = this.reservaRepository.create({
        fechaHora: fecha,
        numeroPersonas,
        cliente, // Asignamos la entidad completa
        mesa, // Asignamos la entidad completa
        clienteId, // Guardamos los IDs
        mesaId,
      });

      return await this.reservaRepository.save(nuevaReserva);
    } catch (error) {
      if (error.code === '23505') {
        // Código de error de PostgreSQL para "unique violation"
        throw new BadRequestException(
          'La mesa ya está reservada en esa fecha y hora',
        );
      }
      console.error(error);
      throw new BadRequestException('Error al crear la reserva');
    }
  }

  findAll() {
    return this.reservaRepository.find();
  }

  async findOne(id: number) {
    const reserva = await this.reservaRepository.findOneBy({ id });
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }
    return reserva;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto) {
    const reserva = await this.findOne(id);
    // Aquí se podrían re-validar capacidad y horario si cambian
    this.reservaRepository.merge(reserva, updateReservaDto);
    return this.reservaRepository.save(reserva);
  }

  // Requerimiento: "Gestionar cancelaciones fácilmente"
  async cancel(id: number) {
    const reserva = await this.findOne(id);
    if (reserva.estado === 'cancelada') {
      throw new BadRequestException('La reserva ya estaba cancelada');
    }
    reserva.estado = 'cancelada';
    return this.reservaRepository.save(reserva);
  }

  // Requerimiento: "Reservas del día"
  async findReservasDelDia(fechaString: string) {
    const inicioDelDia = new Date(`${fechaString}T00:00:00.000Z`);
    const finDelDia = new Date(`${fechaString}T23:59:59.999Z`);

    return this.reservaRepository.find({
      where: {
        fechaHora: Between(inicioDelDia, finDelDia),
        estado: 'confirmada', // Solo las activas
      },
      relations: ['cliente', 'mesa'], // Incluir info de cliente y mesa
      order: {
        fechaHora: 'ASC', // Ordenadas por hora
      },
    });
  }

  // Requerimiento: "Disponibilidad de mesas por fecha/hora"
  async findDisponibilidad(fechaHora: string, numeroPersonas: number) {
    // 1. Encontrar todas las mesas con capacidad suficiente
    const mesasCapaces = await this.mesaRepository.find({
      where: {
        capacidad: MoreThanOrEqual(numeroPersonas),
      },
    });

    // 2. Encontrar qué mesas (de cualquier capacidad) YA están reservadas en esa hora
    const reservasEnEsaHora = await this.reservaRepository.find({
      where: {
        fechaHora: new Date(fechaHora),
        estado: 'confirmada',
      },
    });

    const idsMesasReservadas = reservasEnEsaHora.map(
      (reserva) => reserva.mesaId,
    );

    // 3. Filtrar: Devolver solo las mesas capaces que NO están en la lista de reservadas
    const mesasDisponibles = mesasCapaces.filter(
      (mesa) => !idsMesasReservadas.includes(mesa.id),
    );

    return mesasDisponibles;
  }
}