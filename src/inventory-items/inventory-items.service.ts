import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InventoryItemsService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  create(createInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryItemRepository.save(createInventoryItemDto);
  }

  findAll() {
    // return this.inventoryItemRepository.find();
    return this.inventoryItemRepository.find({
      relations: ['category'],
    });
  }

  findOne(id: number) {
    return this.inventoryItemRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(id: number, updateInventoryItemDto: UpdateInventoryItemDto) {
    const inventoryItem = await this.inventoryItemRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }
    Object.assign(inventoryItem, updateInventoryItemDto);
    return this.inventoryItemRepository.save(inventoryItem);
  }

  remove(id: number) {
    return this.inventoryItemRepository.delete(id);
  }
}
