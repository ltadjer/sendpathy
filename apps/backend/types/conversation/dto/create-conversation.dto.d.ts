import { ConversationType } from '@prisma/client';
export declare class CreateConversationDto {
    userIds: string[];
    conversationType: ConversationType;
}
