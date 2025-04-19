import { PostService } from './post.service';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    findAll(user: any): Promise<any>;
    findOne(id: string, user: any): Promise<any>;
    create(createPostDto: any, user: any): Promise<any>;
    update(id: string, updatePostDto: any): Promise<any>;
    delete(id: string): Promise<any>;
    addTagToPost(postId: string, tagId: string): Promise<any>;
    removeTagFromPost(postId: string, tagId: string): Promise<any>;
    addTriggerToPost(postId: string, triggerId: string): Promise<any>;
    removeTriggerFromPost(postId: string, triggerId: string): Promise<any>;
}
