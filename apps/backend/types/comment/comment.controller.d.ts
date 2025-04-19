import { CommentService } from './comment.service';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    addCommentToPost(postId: string, createCommentDto: any, user: any): Promise<any>;
    removeCommentFromPost(postId: string, commentId: string): Promise<any>;
    addCommentToComment(parentCommentId: string, createCommentDto: any, user: any): Promise<any>;
    removeCommentFromComment(parentCommentId: string, commentId: string): Promise<any>;
}
