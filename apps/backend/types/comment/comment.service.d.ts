import { PrismaService } from '../prisma/prisma.service';
import { NotificationGateway } from '../notification/notification.gateway';
export declare class CommentService {
    private prisma;
    private notificationGateway;
    constructor(prisma: PrismaService, notificationGateway: NotificationGateway);
    addCommentToPost(postId: string, createCommentDto: any, userId: string): Promise<any>;
    addCommentToComment(parentCommentId: string, createCommentDto: any, userId: string): Promise<any>;
    removeCommentFromPost(postId: string, commentId: string): Promise<{
        message: string;
    }>;
    removeCommentFromComment(parentCommentId: string, commentId: string): Promise<{
        message: string;
    }>;
    deleteCommentAndReplies(prisma: PrismaService, commentId: string): Promise<void>;
}
