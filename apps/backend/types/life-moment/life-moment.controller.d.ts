import { LifeMomentService } from './life-moment.service';
export declare class LifeMomentController {
    private readonly lifeMomentService;
    constructor(lifeMomentService: LifeMomentService);
    findAll(user: any): Promise<any>;
    findOne(id: string, user: any): Promise<any>;
    update(id: string, updateLifeMomentDto: any, user: any): Promise<any>;
    create(createLifeMomentDto: any, user: any): Promise<any>;
    delete(id: string, user: any): Promise<any>;
}
