import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from '../notification/notification.gateway';
export declare class LikeService {
    private prisma;
    private notificationGateway;
    constructor(prisma: PrismaService, notificationGateway: NotificationGateway);
    likePost(postId: string, userId: string): Promise<{
        message: string;
        postId?: undefined;
    } | {
        message: string;
        postId: string;
    }>;
    unlikePost(postId: string, userId: string): Promise<{
        message: string;
        postId: string;
    }>;
    likeComment(commentId: string, userId: string): Promise<{
        message: string;
        commentId?: undefined;
    } | {
        message: string;
        commentId: string;
    }>;
    unlikeComment(commentId: string, userId: string): Promise<{
        message: string;
        commentId: string;
    }>;
}
