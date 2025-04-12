import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsageDetailDto } from './dto/create-usage-detail.dto';
import { UpdateUsageDetailDto } from './dto/update-usage-detail.dto';
import { UsageDetail } from './entities/usage-detail.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';

@Injectable()
export class UsageDetailService {
  constructor(
    @InjectRepository(UsageDetail)
    private usageDetailRepository: Repository<UsageDetail>,
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async create(
    createUsageDetailDto: CreateUsageDetailDto,
  ): Promise<UsageDetail> {
    const usageDetail = this.usageDetailRepository.create(createUsageDetailDto);

    // If inventoryItemId is provided, associate with inventory item
    if (createUsageDetailDto.inventoryItemId) {
      const inventoryItem = await this.inventoryItemRepository.findOne({
        where: { id: createUsageDetailDto.inventoryItemId },
      });

      if (!inventoryItem) {
        throw new NotFoundException(
          `Inventory item with ID ${createUsageDetailDto.inventoryItemId} not found`,
        );
      }

      usageDetail.inventoryItem = inventoryItem;

      // Check if productName matches inventory item's name
      if (
        createUsageDetailDto.productName &&
        createUsageDetailDto.productName !== inventoryItem.name
      ) {
        throw new BadRequestException(
          `Product name "${createUsageDetailDto.productName}" does not match inventory item's name "${inventoryItem.name}"`,
        );
      }

      // Check if unit matches inventory item's unit
      if (
        createUsageDetailDto.unit &&
        createUsageDetailDto.unit !== inventoryItem.unit
      ) {
        throw new BadRequestException(
          `Unit "${createUsageDetailDto.unit}" does not match inventory item's unit "${inventoryItem.unit}"`,
        );
      }

      // Set product name and unit if not provided or to ensure they match
      usageDetail.productName = inventoryItem.name;
      usageDetail.unit = inventoryItem.unit;
    }

    // Validate the usage data
    if (!this.validateUsageData(usageDetail)) {
      throw new Error(
        'Invalid usage data. Quantity used must be greater than 0.',
      );
    }

    return this.usageDetailRepository.save(usageDetail);
  }

  findAll() {
    return this.usageDetailRepository.find({
      relations: ['inventoryItem', 'usageRecord'],
    });
  }

  async findOne(id: number) {
    const usageDetail = await this.usageDetailRepository.findOne({
      where: { id },
      relations: ['inventoryItem', 'usageRecord'],
    });

    if (!usageDetail) {
      throw new NotFoundException(`Usage detail with ID ${id} not found`);
    }

    return usageDetail;
  }

  async update(id: number, updateUsageDetailDto: UpdateUsageDetailDto) {
    const usageDetail = await this.findOne(id);

    // Update the entity with the new data
    Object.assign(usageDetail, updateUsageDetailDto);

    // If inventoryItemId is updated, update the inventory item relationship
    if (updateUsageDetailDto.inventoryItemId) {
      const inventoryItem = await this.inventoryItemRepository.findOne({
        where: { id: updateUsageDetailDto.inventoryItemId },
      });

      if (!inventoryItem) {
        throw new NotFoundException(
          `Inventory item with ID ${updateUsageDetailDto.inventoryItemId} not found`,
        );
      }

      usageDetail.inventoryItem = inventoryItem;

      // Check if productName matches inventory item's name
      if (
        updateUsageDetailDto.productName &&
        updateUsageDetailDto.productName !== inventoryItem.name
      ) {
        throw new BadRequestException(
          `Product name "${updateUsageDetailDto.productName}" does not match inventory item's name "${inventoryItem.name}"`,
        );
      }

      // Check if unit matches inventory item's unit
      if (
        updateUsageDetailDto.unit &&
        updateUsageDetailDto.unit !== inventoryItem.unit
      ) {
        throw new BadRequestException(
          `Unit "${updateUsageDetailDto.unit}" does not match inventory item's unit "${inventoryItem.unit}"`,
        );
      }

      // Update product name and unit to ensure they match
      usageDetail.productName = inventoryItem.name;
      usageDetail.unit = inventoryItem.unit;
    }

    // Validate the updated usage data
    if (!this.validateUsageData(usageDetail)) {
      throw new Error(
        'Invalid usage data. Quantity used must be greater than 0.',
      );
    }

    return this.usageDetailRepository.save(usageDetail);
  }

  async remove(id: number) {
    const usageDetail = await this.findOne(id);
    return this.usageDetailRepository.remove(usageDetail);
  }

  // Validate usage data
  validateUsageData(usageDetail: UsageDetail): boolean {
    return usageDetail.quantityUsed > 0;
  }
}
