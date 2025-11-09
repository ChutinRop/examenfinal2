// src/mesas/mesas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mesa } from './entities/mesa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private mesaRepository: Repository<Mesa>,
  ) {}

  create(createMesaDto: CreateMesaDto) {
    const nuevaMesa = this.mesaRepository.create(createMesaDto);
    return this.mesaRepository.save(nuevaMesa);
  }

  findAll() {
    return this.mesaRepository.find();
  }

  async findOne(id: number) {
    const mesa = await this.mesaRepository.findOneBy({ id });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
    }
    return mesa;
  }

  async update(id: number, updateMesaDto: UpdateMesaDto) {
    const mesa = await this.findOne(id);
    this.mesaRepository.merge(mesa, updateMesaDto);
    return this.mesaRepository.save(mesa);
  }

  async remove(id: number) {
    const mesa = await this.findOne(id);
    await this.mesaRepository.remove(mesa);
    return { message: `Mesa con ID ${id} eliminada` };
  }
}