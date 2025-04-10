import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockcheckDetail } from './entities/stockcheck-detail.entity';
import { CreateStockCheckDetailDto } from './dto/create-stockcheck-detail.dto';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { UpdateStockcheckDetailDto } from './dto/update-stockcheck-detail.dto';

@Injectable()
export class StockcheckDetailService {
  constructor(
    @InjectRepository(StockcheckDetail)
    private stockCheckDetailRepository: Repository<StockcheckDetail>,

    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  // คำนวณสถานะว่าเป็น 'normal' หรือ 'warning' ขึ้นอยู่กับ quantity และ minStock
  private calculateStatus(quantity: number, minStock: number): string {
    if (quantity <= minStock) {
      return 'warning'; // ถ้า quantity น้อยกว่าหรือเท่ากับ minStock จะให้สถานะเป็น 'warning'
    }
    return 'normal'; // ถ้ามากกว่าก็จะเป็น 'normal'
  }

  async create(
    createStockcheckDetailDto: CreateStockCheckDetailDto,
  ): Promise<StockcheckDetail[]> {
    const createdDetails: StockcheckDetail[] = [];
    // First validate that all inventoryItemIds exist
    for (const item of createStockcheckDetailDto.items) {
      const product = await this.inventoryItemRepository.findOne({
        where: { id: item.inventoryItemId },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with id ${item.inventoryItemId} not found. All products must exist to proceed.`,
        );
      }
    }

    // If all items exist, proceed with creating the stock check details
    for (const item of createStockcheckDetailDto.items) {
      // Since we already verified existence, we can safely get the product
      const product = await this.inventoryItemRepository.findOne({
        where: { id: item.inventoryItemId },
      });

      // Since we already checked that all products exist, this should never be null
      // but TypeScript doesn't know that, so we'll add a safety check
      if (!product) {
        continue; // Skip this item if product is somehow null
      }

      const productName = product.name;
      const previousQuantity = product.quantity;
      const minStock = product.minStock;
      const unit = product.unit;

      // คำนวณ difference จาก previousQuantity และ newQuantity
      const difference = previousQuantity - item.newQuantity;

      // คำนวณ status จาก quantity และ minStock
      const status = this.calculateStatus(item.newQuantity, minStock);

      // สร้าง StockCheckDetail ใหม่
      const stockCheckDetail = this.stockCheckDetailRepository.create({
        inventoryitem: product,
        previousQuantity,
        newQuantity: item.newQuantity,
        difference,
        productName,
        unit,
        status,
      });

      // บันทึกข้อมูลในฐานข้อมูล
      const savedStockCheckDetail =
        await this.stockCheckDetailRepository.save(stockCheckDetail);
      createdDetails.push(savedStockCheckDetail);

      // อัปเดต InventoryItem quantity เป็น newQuantity
      product.quantity = item.newQuantity;
      await this.inventoryItemRepository.save(product);
    }

    return createdDetails;
  }

  async update(
    id: number,
    updateStockcheckDetailDto: UpdateStockcheckDetailDto,
  ) {
    const stockcheckDetail = await this.stockCheckDetailRepository.findOne({
      where: { id },
      relations: ['inventoryitem'],
    });

    if (!stockcheckDetail) {
      throw new NotFoundException('StockcheckDetail not found');
    }

    // อัปเดต newQuantity
    let newQuantity = updateStockcheckDetailDto.newQuantity;
    newQuantity = stockcheckDetail.newQuantity;

    // คำนวณ previousQuantity และ difference
    const previousQuantity = stockcheckDetail.newQuantity;
    const difference = previousQuantity - newQuantity;

    // อัปเดต StockCheckDetail
    stockcheckDetail.previousQuantity = previousQuantity;
    stockcheckDetail.difference = difference;

    // บันทึกการเปลี่ยนแปลงลงใน StockCheckDetail
    const updatedStockCheckDetail =
      await this.stockCheckDetailRepository.save(stockcheckDetail);

    // อัปเดต InventoryItem ด้วย newQuantity
    const product = stockcheckDetail.inventoryitem;
    product.quantity = newQuantity;
    await this.inventoryItemRepository.save(product); // อัปเดต InventoryItem

    return updatedStockCheckDetail;
  }

  findAll() {
    return this.stockCheckDetailRepository.find({
      relations: ['inventoryitem'], // ดึงข้อมูลที่เชื่อมโยงกับ InventoryItem
    });
  }

  findOne(id: number) {
    return this.stockCheckDetailRepository.findOne({
      where: { id },
      relations: ['inventoryitem'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} stockcheckDetail`;
  }
}
