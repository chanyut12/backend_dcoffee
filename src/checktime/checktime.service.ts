import { Injectable } from '@nestjs/common';
import { CreateCheckTimeDto } from './dto/create-checktime.dto';
import { UpdateCheckTimeDto } from './dto/update-checktime.dto';
import { CheckTime } from './entities/checktime.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CheckTimesService {
  constructor(
    @InjectRepository(CheckTime)
    private readonly checktimeRepository: Repository<CheckTime>,
  ) {}

  create(createCheckTimeDto: CreateCheckTimeDto) {
    return this.checktimeRepository.save(createCheckTimeDto);
  }

  findAll() {
    return this.checktimeRepository.find();
  }

  findOne(id: number) {
    return this.checktimeRepository.findOneOrFail({ where: { id: id } });
  }

  update(id: number, updateCheckTimeDto: UpdateCheckTimeDto) {
    return this.checktimeRepository.update(id, updateCheckTimeDto);
  }

  remove(id: number) {
    return this.checktimeRepository.softDelete(id);
  }
}
