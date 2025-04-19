import { Test, TestingModule } from '@nestjs/testing';
import { AvailableSlotController } from './available-slot.controller.js';

describe('AvailableSlotController', () => {
  let controller: AvailableSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailableSlotController],
    }).compile();

    controller = module.get<AvailableSlotController>(AvailableSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
