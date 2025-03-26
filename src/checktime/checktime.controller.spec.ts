import { Test, TestingModule } from '@nestjs/testing';
import { CheckTimesController } from './checktime.controller';
import { CheckTimesService } from './checktime.service';

describe('CheckTimesController', () => {
  let controller: CheckTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckTimesController],
      providers: [CheckTimesService],
    }).compile();

    controller = module.get<CheckTimesController>(CheckTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
