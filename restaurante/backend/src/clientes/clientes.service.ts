// src/clientes/clientes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  create(createClienteDto: CreateClienteDto) {
    const nuevoCliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(nuevoCliente);
  }

  findAll() {
    return this.clienteRepository.find();
  }

  // Requerimiento: "Historial de cliente"
  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['reservas', 'reservas.mesa'], // Carga sus reservas y las mesas de esas reservas
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }
  
  // Versión simple de findOne (para uso interno si no se necesita el historial)
  async findOneSimple(id: number) {
    const cliente = await this.clienteRepository.findOneBy({ id });
     if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOneSimple(id);
    this.clienteRepository.merge(cliente, updateClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.findOneSimple(id);
    await this.clienteRepository.remove(cliente);
    return { message: `Cliente con ID ${id} eliminado` };
  }
}