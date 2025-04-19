import { Server } from 'socket.io';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { CustomSocket } from './dto/custom-socket.js';
export declare class MessageGateway {
    private readonly messageService;
    server: Server;
    private logger;
    constructor(messageService: MessageService);
    afterInit(server: Server): void;
    handleDisconnect(client: CustomSocket): void;
    handleConnection(client: CustomSocket): void;
    handleMessage(client: CustomSocket, payload: CreateMessageDto): Promise<void>;
    handleUpdateMessage(client: CustomSocket, payload: {
        id: string;
        content: string;
    }): Promise<void>;
    handleDeleteMessage(client: CustomSocket, payload: any): Promise<void>;
    handleDeleteMessageForUser(client: CustomSocket, payload: any): Promise<void>;
}
