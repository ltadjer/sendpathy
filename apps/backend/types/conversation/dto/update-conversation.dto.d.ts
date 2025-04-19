import { ConversationType } from '@prisma/client';
export declare class UpdateConversationDto {
    userIds?: string[];
    conversationType?: ConversationType;
}
