import { Test, TestingModule } from '@nestjs/testing';
import { StockcheckDetailController } from './stockcheck-detail.controller';
import { StockcheckDetailService } from './stockcheck-detail.service';

describe('StockcheckDetailController', () => {
  let controller: StockcheckDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockcheckDetailController],
      providers: [StockcheckDetailService],
    }).compile();

    controller = module.get<StockcheckDetailController>(
      StockcheckDetailController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
