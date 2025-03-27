import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto & { imageUrl: string },
  ): Promise<Product> {
    const newProduct = this.productsRepository.create(createProductDto);
    await this.productsRepository.save(newProduct);
    return this.productsRepository.findOneOrFail({
      where: { id: newProduct.id },
      // relations: ['type'],
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneOrFail({
      where: { id: id },
      // relations: ['type'],
    });
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto & { imageUrl?: string },
  ): Promise<Product> {
    console.log(updateProductDto);
    if (!updateProductDto.imageUrl) {
      delete updateProductDto.file;
      delete updateProductDto.imageUrl;
    }
    await this.productsRepository.update(id, updateProductDto);
    const updatedProduct = await this.productsRepository.findOneByOrFail({
      id,
    });
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.productsRepository.softRemove(product);
  }
}
