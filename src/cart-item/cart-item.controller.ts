import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartItem } from './entities/cart-item.entity';
import { CartItemDto } from './dto/cart-item.dto';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @ApiOperation({ summary: 'Add items to cart' })
  @ApiResponse({
    status: 201,
    description: 'The items have been successfully added to cart',
    type: [CartItem],
  })
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(createCartItemDto);
  }

  @Post('single')
  @ApiOperation({ summary: 'Add a single item to cart' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully added to cart',
    type: CartItem,
  })
  createSingle(@Body() cartItemDto: CartItemDto) {
    return this.cartItemService.createSingle(cartItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items in cart' })
  @ApiResponse({
    status: 200,
    description: 'List of all items in cart',
    type: [CartItem],
  })
  findAll() {
    return this.cartItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific cart item' })
  @ApiResponse({
    status: 200,
    description: 'The found cart item',
    type: CartItem,
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  findOne(@Param('id') id: string) {
    return this.cartItemService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cart item' })
  @ApiResponse({
    status: 200,
    description: 'The cart item has been successfully updated',
    type: CartItem,
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a cart item' })
  @ApiResponse({
    status: 204,
    description: 'The cart item has been successfully removed',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(+id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the entire cart' })
  @ApiResponse({
    status: 204,
    description: 'The cart has been successfully cleared',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  clearCart() {
    return this.cartItemService.clearCart();
  }

  @Get('order/prepare')
  @ApiOperation({ summary: 'Get all cart items for creating an order' })
  @ApiResponse({
    status: 200,
    description: 'List of cart items eligible for order',
    type: [CartItem],
  })
  getForOrder() {
    return this.cartItemService.getAllForOrder();
  }
}
