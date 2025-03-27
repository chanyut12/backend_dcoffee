import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateOrderDetailDto {

    @ApiProperty({
        description: 'The inventory item ID',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    inventoryItemId: number;  // ใช้สำหรับเชื่อมโยงกับ inventory_item

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The name of the inventory item',
        example: 'Capushino',
    })
    name: string;

    @ApiProperty({
        description: 'The quantity of the inventory item to be received',
        example: 10,
    })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;  // จำนวนสินค้าที่รับเข้ามาใหม่

    @ApiProperty({
        description: 'The unit of the inventory item',
        example: 'kg',
    })
    @IsNotEmpty()
    @IsString()
    unit: string;  // หน่วยของสินค้า เช่น kg, piece, etc.

    @ApiProperty({
        description: 'The price of the inventory item',
        example: 10,
    })
    @IsNotEmpty()
    @IsNumber()
    price: number;  // ราคาของสินค้า

    @ApiProperty({
        description: 'The supplier of the inventory item',
        example: 'Coffee Bangsaen',
    })
    @IsNotEmpty()
    @IsString()
    supplier: string;

    @ApiProperty({
        description: 'The date when the stock was received',
        example: '2021-01-01',
    })
    @IsNotEmpty()
    @IsDateString()
    receivedDate: string;  // วันที่รับสินค้าเข้ามา


    // @ApiProperty({
    //     description: 'The last order date of the inventory item',
    //     example: '2021-01-01',
    // })
    // @IsNotEmpty()
    // @IsDateString()
    // lastOrder: string;
}

