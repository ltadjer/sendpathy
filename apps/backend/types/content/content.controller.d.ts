import { ContentService } from './content.service';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    create(contentDto: any, lifeMomentId: string): Promise<any>;
    findAll(lifeMomentId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateContentDto: any): Promise<any>;
    delete(id: string): Promise<any>;
}
