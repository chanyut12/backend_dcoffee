import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>, // inject InventoryItem repository
  ) { }

  // ฟังก์ชันนี้จะเพิ่มข้อมูลคำสั่งซื้อใหม่
  async create(orderDetailData: any) {
    const newOrderDetail = this.orderDetailRepository.create(orderDetailData);
    return this.orderDetailRepository.save(newOrderDetail);
  }

  // ฟังก์ชันนี้จะเพิ่มข้อมูลหรืออัพเดทข้อมูลใน inventory item และ order detail
  async createOrUpdate(orderDetailData: CreateOrderDetailDto) {
    // ค้นหาสินค้าใน inventory_item โดยใช้ id จาก order_detail
    let inventoryItem = await this.inventoryItemRepository.findOne({
      where: { id: orderDetailData.inventoryItemId }, // ใช้ id ที่รับมา
    });

    if (inventoryItem) {
      // ถ้ามีสินค้าในคลังอยู่แล้ว, บวกจำนวนสินค้าที่รับเข้ามา
      inventoryItem.quantity += orderDetailData.quantity;
      inventoryItem.price += orderDetailData.price;

      // บันทึกการอัพเดทข้อมูลใน order_detail
      await this.inventoryItemRepository.save(inventoryItem);
    } else {
      // ถ้าไม่มีสินค้าในคลัง, สร้างสินค้าใหม่
      inventoryItem = this.inventoryItemRepository.create({
        name: orderDetailData.name,
        quantity: orderDetailData.quantity,
        unit: orderDetailData.unit,
        price: orderDetailData.price,
        supplier: orderDetailData.supplier,
      });
      await this.inventoryItemRepository.save(inventoryItem); // บันทึกสินค้าใหม่
    }

    // สร้างหรือบันทึกคำสั่งซื้อใน order_detail
    const newOrderDetail = this.orderDetailRepository.create({
      ...orderDetailData,
      inventoryItem,  // ใส่ความสัมพันธ์กับ inventoryItem
    });
    return this.orderDetailRepository.save(newOrderDetail);
  }

  findAll() {
    return this.orderDetailRepository.find();
  }

  async update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { id },
    });
    if (!orderDetail) {
      throw new NotFoundException('Order not found');
    }
    Object.assign(orderDetail, updateOrderDetailDto);
    return this.orderDetailRepository.save(orderDetail);
  }

  remove(id: number) {
    return this.orderDetailRepository.delete(id);
  }
}
