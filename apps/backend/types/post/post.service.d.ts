import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ExtendedPost } from './dto/extended-post.dto';
export declare class PostService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string, userId: string): Promise<ExtendedPost | null>;
    findAll(userId: string): Promise<ExtendedPost[]>;
    private fetchReplies;
    create(createPostDto: CreatePostDto, userId: string): Promise<any>;
    update(id: string, updatePostDto: UpdatePostDto): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
    addTagToPost(postId: string, tagId: string): Promise<any>;
    removeTagFromPost(postId: string, tagId: string): Promise<{
        message: string;
    }>;
    addTriggerToPost(postId: string, triggerId: string): Promise<any>;
    removeTriggerFromPost(postId: string, triggerId: string): Promise<{
        message: string;
    }>;
}
