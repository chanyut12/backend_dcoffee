import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from './entities/type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}
  create(createTypeDto: CreateTypeDto) {
    return this.typeRepository.save(createTypeDto);
  }
  findAll() {
    return this.typeRepository.find();
  }

  findOne(id: number) {
    return this.typeRepository.findOneBy({ id });
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return this.typeRepository.update(id, updateTypeDto);
  }

  remove(id: number) {
    return this.typeRepository.delete(id);
  }
}
