import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { MessageService } from "../message/message.service";
export declare class ConversationController {
    private readonly conversationService;
    private readonly messageService;
    constructor(conversationService: ConversationService, messageService: MessageService);
    create(createConversationDto: CreateConversationDto): Promise<any>;
    findAll(user: any): Promise<any>;
    findOne(id: string, user: any): Promise<any>;
    findMessagesByConversation(conversationId: string, user: any, page?: number, limit?: number): Promise<any>;
    update(id: string, updateConversationDto: UpdateConversationDto, user: any): Promise<any>;
    delete(id: string, user: any): Promise<{
        message: string;
    }>;
    markMessagesAsRead(conversationId: string, user: any): Promise<any>;
}
