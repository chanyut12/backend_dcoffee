import { Test, TestingModule } from '@nestjs/testing';
import { StockcheckRecordController } from './stockcheck-record.controller';
import { StockcheckRecordService } from './stockcheck-record.service';

describe('StockcheckRecordController', () => {
  let controller: StockcheckRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockcheckRecordController],
      providers: [StockcheckRecordService],
    }).compile();

    controller = module.get<StockcheckRecordController>(
      StockcheckRecordController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
