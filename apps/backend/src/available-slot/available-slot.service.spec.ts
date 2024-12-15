import { Test, TestingModule } from '@nestjs/testing';
import { AvailableSlotService } from './available-slot.service';

describe('AvailableSlotService', () => {
  let service: AvailableSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailableSlotService],
    }).compile();

    service = module.get<AvailableSlotService>(AvailableSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
