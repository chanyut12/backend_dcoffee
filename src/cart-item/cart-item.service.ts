import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem[]> {
    const results: CartItem[] = [];

    // Process each item in the array
    for (const cartItemDto of createCartItemDto.items) {
      // Find the inventory item
      const inventoryItem = await this.inventoryItemRepository.findOne({
        where: { id: cartItemDto.inventoryItemId },
      });

      if (!inventoryItem) {
        throw new NotFoundException(
          `Inventory item with ID ${cartItemDto.inventoryItemId} not found`,
        );
      }

      // Check if cart item already exists
      let cartItem = await this.cartItemRepository.findOne({
        where: { id: inventoryItem.id },
      });

      if (cartItem) {
        // Update order quantity if already exists
        cartItem.orderQuantity = cartItemDto.orderQuantity;
        cartItem.calculateTotalPrice();
        results.push(await this.cartItemRepository.save(cartItem));
      } else {
        // Create new cart item from inventory item
        cartItem = this.cartItemRepository.create({
          id: inventoryItem.id,
          name: inventoryItem.name,
          category: inventoryItem.category ? inventoryItem.category.name : '',
          quantity: inventoryItem.quantity,
          unit: inventoryItem.unit,
          minStock: inventoryItem.minStock,
          price: inventoryItem.price,
          supplier: inventoryItem.supplier,
          lastOrder: inventoryItem.lastOrder,
          orderQuantity: cartItemDto.orderQuantity,
        });

        // Calculate total price
        cartItem.calculateTotalPrice();
        results.push(await this.cartItemRepository.save(cartItem));
      }
    }

    return results;
  }

  async createSingle(cartItemDto: CartItemDto): Promise<CartItem> {
    // Find the inventory item
    const inventoryItem = await this.inventoryItemRepository.findOne({
      where: { id: cartItemDto.inventoryItemId },
    });

    if (!inventoryItem) {
      throw new NotFoundException(
        `Inventory item with ID ${cartItemDto.inventoryItemId} not found`,
      );
    }

    // Check if cart item already exists
    let cartItem = await this.cartItemRepository.findOne({
      where: { id: inventoryItem.id },
    });

    if (cartItem) {
      // Update order quantity if already exists
      cartItem.orderQuantity = cartItemDto.orderQuantity;
      cartItem.calculateTotalPrice();
      return this.cartItemRepository.save(cartItem);
    }

    // Create new cart item from inventory item
    cartItem = this.cartItemRepository.create({
      id: inventoryItem.id,
      name: inventoryItem.name,
      category: inventoryItem.category ? inventoryItem.category.name : '',
      quantity: inventoryItem.quantity,
      unit: inventoryItem.unit,
      minStock: inventoryItem.minStock,
      price: inventoryItem.price,
      supplier: inventoryItem.supplier,
      lastOrder: inventoryItem.lastOrder,
      orderQuantity: cartItemDto.orderQuantity,
    });

    // Calculate total price
    cartItem.calculateTotalPrice();

    return this.cartItemRepository.save(cartItem);
  }

  async findAll(): Promise<CartItem[]> {
    return this.cartItemRepository.find();
  }

  async findOne(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    return cartItem;
  }

  async update(
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = await this.findOne(id);

    if (updateCartItemDto.orderQuantity) {
      cartItem.orderQuantity = updateCartItemDto.orderQuantity;
      cartItem.calculateTotalPrice();
    }

    return this.cartItemRepository.save(cartItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cartItemRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
  }

  async clearCart(): Promise<void> {
    await this.cartItemRepository.clear();
  }

  async getAllForOrder(): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      where: { orderQuantity: 0 },
    });
  }
}
