import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>, // inject InventoryItem repository
  ) {}

  // ฟังก์ชันนี้จะเพิ่มข้อมูลคำสั่งซื้อใหม่
  async create(
    createOrderDetailDto: CreateOrderDetailDto,
  ): Promise<OrderDetail> {
    const newOrderDetail =
      this.orderDetailRepository.create(createOrderDetailDto);

    if (createOrderDetailDto.inventoryItemId) {
      const inventoryItem = await this.inventoryItemRepository.findOne({
        where: { id: createOrderDetailDto.inventoryItemId },
      });

      if (!inventoryItem) {
        throw new NotFoundException(
          `Inventory item with ID ${createOrderDetailDto.inventoryItemId} not found`,
        );
      }

      newOrderDetail.inventoryItem = inventoryItem;
    }

    // Calculate total price
    newOrderDetail.calculateTotalPrice();

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
      inventoryItem, // ใส่ความสัมพันธ์กับ inventoryItem
    });
    return this.orderDetailRepository.save(newOrderDetail);
  }

  async createFromCartItem(cartItem: CartItem): Promise<OrderDetail> {
    const inventoryItem = await this.inventoryItemRepository.findOne({
      where: { id: cartItem.id },
    });

    if (!inventoryItem) {
      throw new NotFoundException(
        `Inventory item with ID ${cartItem.id} not found`,
      );
    }

    const orderDetail = this.orderDetailRepository.create({
      name: cartItem.name,
      quantity: cartItem.orderQuantity,
      unit: cartItem.unit,
      price: cartItem.price,
      supplier: cartItem.supplier,
      inventoryItem: inventoryItem,
    });

    // Calculate total price
    orderDetail.calculateTotalPrice();

    return orderDetail;
  }

  async findAll(): Promise<OrderDetail[]> {
    return this.orderDetailRepository.find({
      relations: ['inventoryItem'],
    });
  }

  async findOne(id: number): Promise<OrderDetail> {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { id },
      relations: ['inventoryItem'],
    });

    if (!orderDetail) {
      throw new NotFoundException(`Order detail with ID ${id} not found`);
    }

    return orderDetail;
  }

  async update(
    id: number,
    updateOrderDetailDto: UpdateOrderDetailDto,
  ): Promise<OrderDetail> {
    const orderDetail = await this.findOne(id);

    // Update fields
    Object.assign(orderDetail, updateOrderDetailDto);

    // If inventory item ID is provided, update the relationship
    if (updateOrderDetailDto.inventoryItemId) {
      const inventoryItem = await this.inventoryItemRepository.findOne({
        where: { id: updateOrderDetailDto.inventoryItemId },
      });

      if (!inventoryItem) {
        throw new NotFoundException(
          `Inventory item with ID ${updateOrderDetailDto.inventoryItemId} not found`,
        );
      }

      orderDetail.inventoryItem = inventoryItem;
    }

    // Recalculate total
    orderDetail.calculateTotalPrice();

    return this.orderDetailRepository.save(orderDetail);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderDetailRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order detail with ID ${id} not found`);
    }
  }
}
