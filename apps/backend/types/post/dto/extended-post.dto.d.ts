import { Post, Comment, Like, Trigger, Tag, User } from '@prisma/client';
export interface ExtendedPost extends Post {
    comments: (Comment & {
        user: User;
    })[];
    likes: Like[];
    triggers: Trigger[];
    tags: Tag[];
    user: User;
    isLiked?: boolean;
}
