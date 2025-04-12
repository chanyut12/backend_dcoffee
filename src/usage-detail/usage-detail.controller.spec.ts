import { Test, TestingModule } from '@nestjs/testing';
import { UsageDetailController } from './usage-detail.controller';
import { UsageDetailService } from './usage-detail.service';

describe('UsageDetailController', () => {
  let controller: UsageDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsageDetailController],
      providers: [UsageDetailService],
    }).compile();

    controller = module.get<UsageDetailController>(UsageDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
