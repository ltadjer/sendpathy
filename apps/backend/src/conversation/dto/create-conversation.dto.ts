import { ConversationType } from '@prisma/client';

export class CreateConversationDto {
    userIds: string[];
    conversationType: ConversationType;
}