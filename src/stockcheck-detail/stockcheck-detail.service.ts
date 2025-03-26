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

  async create(
    createStockcheckDetailDto: CreateStockCheckDetailDto,
  ): Promise<StockcheckDetail> {
    // ดึงข้อมูล InventoryItem จากฐานข้อมูลโดยใช้ id ที่มาจาก object inventoryitem
    const product = await this.inventoryItemRepository.findOne({
      where: { id: createStockcheckDetailDto.inventoryitem.id },
    });

    // ถ้าไม่พบสินค้าให้โยน NotFoundException
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // ใช้ quantity ของ InventoryItem เป็น previousQuantity
    const previousQuantity = product.quantity;

    // คำนวณ difference จาก previousQuantity และ newQuantity
    const difference = previousQuantity - createStockcheckDetailDto.newQuantity;

    // สร้าง StockCheckDetail ใหม่
    const stockCheckDetail = this.stockCheckDetailRepository.create({
      ...createStockcheckDetailDto, // ใช้ข้อมูลจาก DTO
      inventoryitem: product, // เชื่อมโยงกับ InventoryItem
      previousQuantity: previousQuantity, // ใช้ quantity ของ InventoryItem เป็น previousQuantity
      difference, // บันทึกผลต่าง
    });

    // บันทึกข้อมูลในฐานข้อมูล
    const savedStockCheckDetail =
      await this.stockCheckDetailRepository.save(stockCheckDetail);

    // อัปเดต InventoryItem quantity เป็น newQuantity
    product.quantity = createStockcheckDetailDto.newQuantity;
    await this.inventoryItemRepository.save(product); // บันทึกข้อมูลใหม่ของ InventoryItem

    return savedStockCheckDetail;
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
