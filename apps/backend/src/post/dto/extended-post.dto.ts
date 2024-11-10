import { Post, Comment, Like, trigger, tag, User } from '@prisma/client';

export interface ExtendedPost extends Post {
    comments: (Comment & { user: User })[];
    likes: Like[];
    triggers: trigger[];
    tags: tag[];
    user: User;
    isLiked?: boolean;
}