import { Test, TestingModule } from '@nestjs/testing';
import { StockcheckRecordService } from './stockcheck-record.service';

describe('StockcheckRecordService', () => {
  let service: StockcheckRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockcheckRecordService],
    }).compile();

    service = module.get<StockcheckRecordService>(StockcheckRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
