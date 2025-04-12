import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderRecordDto } from './dto/create-order-record.dto';
import { UpdateOrderRecordDto } from './dto/update-order-record.dto';
import { OrderRecord } from './entities/order-record.entity';
import { OrderDetailService } from 'src/order-detail/order-detail.service';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';

@Injectable()
export class OrderRecordService {
  constructor(
    @InjectRepository(OrderRecord)
    private orderRecordRepository: Repository<OrderRecord>,
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    private orderDetailService: OrderDetailService,
    private cartItemService: CartItemService,
  ) {}

  async create(
    createOrderRecordDto: CreateOrderRecordDto,
  ): Promise<OrderRecord> {
    const newOrderRecord = this.orderRecordRepository.create({
      ...createOrderRecordDto,
      userId: createOrderRecordDto.userId || 1,
      orderDate: new Date(),
      status: 'pending',
    });

    return this.orderRecordRepository.save(newOrderRecord);
  }

  async createFromCart(
    createOrderRecordDto: CreateOrderRecordDto,
  ): Promise<OrderRecord> {
    // Get all cart items
    const cartItems = await this.cartItemService.findAll();

    if (!cartItems || cartItems.length === 0) {
      throw new NotFoundException('No items in cart to create order');
    }

    // Create a new order record
    const orderRecord = this.orderRecordRepository.create({
      ...createOrderRecordDto,
      userId: createOrderRecordDto.userId || 1,
      orderDate: new Date(),
      status: 'pending',
      details: [],
    });

    // Save order record first to get ID
    const savedOrderRecord = await this.orderRecordRepository.save(orderRecord);

    // Create order details from cart items
    for (const cartItem of cartItems) {
      // Skip items with 0 order quantity
      if (cartItem.orderQuantity <= 0) continue;

      const orderDetail =
        await this.orderDetailService.createFromCartItem(cartItem);
      orderDetail.orderRecord = savedOrderRecord;
      orderDetail.orderRecordId = savedOrderRecord.id;

      savedOrderRecord.details.push(
        await this.orderDetailService.create(orderDetail),
      );
    }

    // Calculate total
    savedOrderRecord.calculateTotal();

    // Save the order with details
    const finalOrderRecord =
      await this.orderRecordRepository.save(savedOrderRecord);

    // Clear the cart after successful order creation
    await this.cartItemService.clearCart();

    return finalOrderRecord;
  }

  async findAll(): Promise<OrderRecord[]> {
    return this.orderRecordRepository.find({
      relations: ['details', 'details.inventoryItem', 'user'],
    });
  }

  async findOne(id: number): Promise<OrderRecord> {
    const orderRecord = await this.orderRecordRepository.findOne({
      where: { id },
      relations: ['details', 'details.inventoryItem', 'user'],
    });

    if (!orderRecord) {
      throw new NotFoundException(`Order record with ID ${id} not found`);
    }

    return orderRecord;
  }

  async update(
    id: number,
    updateOrderRecordDto: UpdateOrderRecordDto,
  ): Promise<OrderRecord> {
    const orderRecord = await this.findOne(id);

    // Update basic fields
    Object.assign(orderRecord, updateOrderRecordDto);

    // Recalculate total
    orderRecord.calculateTotal();

    return this.orderRecordRepository.save(orderRecord);
  }

  async updateStatus(
    id: number,
    status: 'pending' | 'delivered' | 'cancelled',
  ): Promise<OrderRecord> {
    const orderRecord = await this.findOne(id);

    // Update status using the entity method
    orderRecord.trackOrderStatus(status);

    // If delivered, update inventory items
    if (status === 'delivered') {
      await this.updateInventoryOnDelivery(orderRecord);
    }

    return this.orderRecordRepository.save(orderRecord);
  }

  private async updateInventoryOnDelivery(
    orderRecord: OrderRecord,
  ): Promise<void> {
    // Process each order detail
    for (const detail of orderRecord.details) {
      if (detail.inventoryItem) {
        const inventoryItem = await this.inventoryItemRepository.findOne({
          where: { id: detail.inventoryItem.id },
        });

        if (inventoryItem) {
          // Update inventory quantity
          inventoryItem.quantity += detail.quantity;

          // Update last order date
          inventoryItem.lastOrder = new Date().toISOString().split('T')[0];

          // Save the updated inventory item
          await this.inventoryItemRepository.save(inventoryItem);
        }
      }
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRecordRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order record with ID ${id} not found`);
    }
  }
}
