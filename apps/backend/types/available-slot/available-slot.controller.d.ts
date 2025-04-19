import { AvailableSlotService } from './available-slot.service';
export declare class AvailableSlotController {
    private readonly availableSlotService;
    constructor(availableSlotService: AvailableSlotService);
    createSlots(createSlotsDto: any, user: any): Promise<any>;
    findAll(): Promise<any>;
}
