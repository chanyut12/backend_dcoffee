import { Test, TestingModule } from '@nestjs/testing';
import { StockcheckDetailService } from './stockcheck-detail.service';

describe('StockcheckDetailService', () => {
  let service: StockcheckDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockcheckDetailService],
    }).compile();

    service = module.get<StockcheckDetailService>(StockcheckDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
