import { LikeService } from './like.service';
export declare class LikeController {
    private readonly likeService;
    constructor(likeService: LikeService);
    likePost(postId: string, user: any): Promise<any>;
    unlikePost(postId: string, user: any): Promise<any>;
    likeComment(commentId: string, user: any): Promise<any>;
    unlikeComment(commentId: string, user: any): Promise<any>;
}
