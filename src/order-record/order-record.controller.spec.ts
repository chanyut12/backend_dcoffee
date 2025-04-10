import { Test, TestingModule } from '@nestjs/testing';
import { OrderRecordController } from './order-record.controller';
import { OrderRecordService } from './order-record.service';

describe('OrderRecordController', () => {
  let controller: OrderRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderRecordController],
      providers: [OrderRecordService],
    }).compile();

    controller = module.get<OrderRecordController>(OrderRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
