import { ConversationType } from '@prisma/client';

export class UpdateConversationDto {
    userIds?: string[];
    conversationType?: ConversationType;
}