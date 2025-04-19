import { TagService } from './tag.service';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createTagDto: any): Promise<any>;
    update(id: string, updateTagDto: any): Promise<any>;
    delete(id: string): Promise<any>;
}
