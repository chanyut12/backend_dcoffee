import { Module } from '@nestjs/common';
import { CheckTimesService } from './checktime.service';
import { CheckTimesController } from './checktime.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckTime } from './entities/checktime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckTime])],
  controllers: [CheckTimesController],
  providers: [CheckTimesService],
  exports: [CheckTimesService],
})
export class CheckTimesModule {}
