import { CartItemDto } from './cart-item.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCartItemDto extends PartialType(CartItemDto) {}
