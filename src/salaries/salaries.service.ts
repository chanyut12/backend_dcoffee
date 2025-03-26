import { Injectable } from '@nestjs/common';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { Salary } from './entities/salary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SalariesService {
  constructor(
    @InjectRepository(Salary)
    private readonly typeRepository: Repository<Salary>,
  ) {}

  create(createSalaryDto: CreateSalaryDto) {
    return this.typeRepository.save(createSalaryDto);
  }

  findAll() {
    return this.typeRepository.find();
  }

  findOne(id: number) {
    return this.typeRepository.findOneOrFail({ where: { id: id } });
  }

  update(id: number, updateSalaryDto: UpdateSalaryDto) {
    return this.typeRepository.update(id, updateSalaryDto);
  }

  remove(id: number) {
    return this.typeRepository.softDelete(id);
  }
}
