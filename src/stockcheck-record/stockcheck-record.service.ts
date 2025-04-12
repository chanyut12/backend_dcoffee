import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStockcheckRecordDto } from './dto/create-stockcheck-record.dto';
import { UpdateStockcheckRecordDto } from './dto/update-stockcheck-record.dto';
import { StockcheckRecord } from './entities/stockcheck-record.entity';
import { StockcheckDetail } from 'src/stockcheck-detail/entities/stockcheck-detail.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class StockcheckRecordService {
  constructor(
    @InjectRepository(StockcheckRecord)
    private stockcheckRecordRepository: Repository<StockcheckRecord>,

    @InjectRepository(StockcheckDetail)
    private stockcheckDetailRepository: Repository<StockcheckDetail>,

    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createStockcheckRecordDto: CreateStockcheckRecordDto) {
    // First validate that all inventoryItemIds exist
    for (const item of createStockcheckRecordDto.items) {
      const product = await this.inventoryItemRepository.findOne({
        where: { id: item.inventoryItemId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with id ${item.inventoryItemId} not found. All products must exist to proceed.`,
        );
      }
    }

    // Find the user
    const user = await this.userRepository.findOne({
      where: { id: createStockcheckRecordDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id ${createStockcheckRecordDto.userId} not found.`,
      );
    }

    // Create new stockcheck record
    const stockcheckRecord = this.stockcheckRecordRepository.create({
      checkDate: createStockcheckRecordDto.checkDate,
      staffName: createStockcheckRecordDto.staffName,
      note: createStockcheckRecordDto.note,
      stockcheckDetails: [],
      user: user, // ตั้งค่า user จาก userId ที่รับมา
    });

    // Save the stockcheck record first to get an ID
    const savedRecord =
      await this.stockcheckRecordRepository.save(stockcheckRecord);

    // Create stockcheck details
    const details: StockcheckDetail[] = [];
    for (const item of createStockcheckRecordDto.items) {
      const product = await this.inventoryItemRepository.findOne({
        where: { id: item.inventoryItemId },
      });

      if (!product) {
        continue; // Skip this item if product is somehow null (shouldn't happen due to validation above)
      }

      const productName = product.name;
      const previousQuantity = product.quantity;
      const minStock = product.minStock;
      const unit = product.unit;
      const difference = previousQuantity - item.newQuantity;

      // Calculate status
      let status = 'normal';
      if (item.newQuantity <= minStock) {
        status = 'warning';
      }

      // Create stockcheck detail
      const stockcheckDetail = this.stockcheckDetailRepository.create({
        inventoryitem: product,
        productName,
        previousQuantity,
        newQuantity: item.newQuantity,
        unit,
        difference,
        status,
        stockcheckRecord: savedRecord,
      });

      const savedDetail =
        await this.stockcheckDetailRepository.save(stockcheckDetail);
      details.push(savedDetail);

      // Update inventory item quantity
      product.quantity = item.newQuantity;
      await this.inventoryItemRepository.save(product);
    }

    // Get the complete record with details
    return this.findOne(savedRecord.id);
  }

  async findAll() {
    return this.stockcheckRecordRepository.find({
      relations: [
        'stockcheckDetails',
        'stockcheckDetails.inventoryitem',
        'user',
      ],
      order: { checkDate: 'DESC' },
    });
  }

  async findOne(id: number) {
    const record = await this.stockcheckRecordRepository.findOne({
      where: { id },
      relations: [
        'stockcheckDetails',
        'stockcheckDetails.inventoryitem',
        'user',
      ],
    });

    if (!record) {
      throw new NotFoundException(`StockcheckRecord with id ${id} not found`);
    }

    return record;
  }

  async update(
    id: number,
    updateStockcheckRecordDto: UpdateStockcheckRecordDto,
  ) {
    const stockcheckRecord = await this.findOne(id);

    // We'll only update the record information, not the details
    if (updateStockcheckRecordDto.checkDate) {
      stockcheckRecord.checkDate = updateStockcheckRecordDto.checkDate;
    }

    if (updateStockcheckRecordDto.staffName) {
      stockcheckRecord.staffName = updateStockcheckRecordDto.staffName;
    }

    if (updateStockcheckRecordDto.note !== undefined) {
      stockcheckRecord.note = updateStockcheckRecordDto.note;
    }

    // Update user if userId is provided
    if (updateStockcheckRecordDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateStockcheckRecordDto.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `User with id ${updateStockcheckRecordDto.userId} not found.`,
        );
      }

      stockcheckRecord.user = user;
    }

    return this.stockcheckRecordRepository.save(stockcheckRecord);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return this.stockcheckRecordRepository.remove(record);
  }
}
