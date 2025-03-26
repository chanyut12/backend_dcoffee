import { Module } from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { SalariesController } from './salaries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salary } from './entities/salary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salary])],
  controllers: [SalariesController],
  providers: [SalariesService],
  exports: [SalariesService],
})
export class SalariesModule {}
