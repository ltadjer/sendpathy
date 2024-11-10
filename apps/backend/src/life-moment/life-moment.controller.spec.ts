import { Test, TestingModule } from '@nestjs/testing';
import { LifeMomentController } from './life-moment.controller';

describe('LifeMomentController', () => {
  let controller: LifeMomentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifeMomentController],
    }).compile();

    controller = module.get<LifeMomentController>(LifeMomentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
