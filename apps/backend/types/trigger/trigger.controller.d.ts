import { TriggerService } from './trigger.service';
export declare class TriggerController {
    private readonly triggerService;
    constructor(triggerService: TriggerService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createTriggerDto: any): Promise<any>;
    update(id: string, updateTriggerDto: any): Promise<any>;
    delete(id: string): Promise<any>;
}
