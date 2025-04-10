import { Test, TestingModule } from '@nestjs/testing';
import { OrderRecordService } from './order-record.service';

describe('OrderRecordService', () => {
  let service: OrderRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderRecordService],
    }).compile();

    service = module.get<OrderRecordService>(OrderRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
