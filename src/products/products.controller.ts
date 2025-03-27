import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างสินค้าใหม่' })
  @ApiConsumes('multipart/form-data') //multipart/form-data is string
  @ApiBody({ description: 'ข้อมูลสินค้า', type: CreateProductDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          console.log(file);
          //const uniqueFileName = Date.now() + extname(file.originalname);
          const uniqueFileName = uuidv4() + extname(file.originalname);
          //extname = extention name ex. jpeg
          //find unique use Date or UUID
          callback(null, uniqueFileName);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    console.log(file);
    return this.productsService.create({
      ...createProductDto,
      imageUrl: file
        ? '/product-images/' + file.filename
        : '/product-images/unknown.jpg',
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ปรับปรุงสินค้า' })
  @ApiConsumes('multipart/form-data') //multipart/form-data is string
  @ApiBody({ description: 'ข้อมูลสินค้า', type: UpdateProductDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          console.log(file);
          //const uniqueFileName = Date.now() + extname(file.originalname);
          const uniqueFileName = uuidv4() + extname(file.originalname);
          //extname = extention name ex. jpeg
          //find unique use Date or UUID
          callback(null, uniqueFileName);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);

    return this.productsService.update(+id, {
      ...updateProductDto,
      imageUrl: file ? '/product-images/' + file.filename : undefined,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
