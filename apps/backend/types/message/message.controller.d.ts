import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './dto/update-message.dto';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createMessageDto: CreateMessageDto, user: any): Promise<any>;
    update(id: string, updateMessageDto: UpdateMessageDto, user: any): Promise<any>;
    delete(id: string): Promise<any>;
    deleteForUser(id: string, user: any): Promise<any>;
}
