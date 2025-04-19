import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { ExtendedPost } from './dto/extended-post.dto.js';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async findOne(id: string, userId: string): Promise<ExtendedPost | null> {
        const post = await this.prisma.post.findUnique({
            where: { id: id },
            include: {
                comments: {
                    where: { parentId: null },
                    include: {
                        user: true,
                        likes: true,
                    },
                },
                likes: true,
                triggers: true,
                tags: true,
                user: true,
            },
        }) as ExtendedPost | null;

        if (post) {
            post.comments = await this.fetchReplies(post.comments, userId);
            post.isLiked = post.likes.some((like: any) => like.userId === userId);
        }

        return post;
    }

    async findAll(userId: string): Promise<ExtendedPost[]> {
        const posts = await this.prisma.post.findMany({
            include: {
                comments: {
                    where: { parentId: null },
                    include: {
                        user: true,
                        likes: true,
                    },
                },
                likes: true,
                triggers: true,
                tags: true,
                user: true,
            },
        }) as ExtendedPost[];

        for (const post of posts) {
            post.comments = await this.fetchReplies(post.comments, userId);
            post.isLiked = post.likes.some((like: any) => like.userId === userId);
        }

        return posts;
    }

    private async fetchReplies(comments: any[], userId: string): Promise<any[]> {
        for (const comment of comments) {
            const replies = await this.prisma.comment.findMany({
                where: { parentId: comment.id },
                include: {
                    user: true,
                    likes: true,
                },
            });

            comment.replies = await this.fetchReplies(replies, userId);
            comment.isLiked = comment.likes.some((like: any) => like.userId === userId);
        }

        return comments;
    }

    async create(createPostDto: CreatePostDto, userId: string) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        return await this.prisma.post.create({
            data: {
                ...createPostDto,
                user: { connect: { id: userId } },
            },
            include: {
                user: true,
                tags: true,
                triggers: true,
            },
        });
    }

    async update(id: string, updatePostDto: UpdatePostDto) {
        return await this.prisma.post.update({
            where: { id },
            data: updatePostDto,
            include: {
                user: true,
                tags: true,
                triggers: true,
            },
        });
    }


    async delete(id: string) {
        await this.prisma.post.delete({
            where: { id: id }
        });
        return { message: 'Post deleted' };
    }

    async addTagToPost(postId: string, tagId: string) {
        return await this.prisma.post.update({
            where: { id: postId },
            data: {
                tags: {
                    connect: { id: tagId }
                }
            }
        });
    }

    async removeTagFromPost(postId: string, tagId: string) {
        await this.prisma.post.update({
            where: { id: postId },
            data: {
                tags: {
                    disconnect: { id: tagId }
                }
            }
        });
        return { message: 'Tag removed from post' };
    }

    async addTriggerToPost(postId: string, triggerId: string) {
        return await this.prisma.post.update({
            where: { id: postId },
            data: {
                triggers: {
                    connect: { id: triggerId }
                }
            }
        });
    }

    async removeTriggerFromPost(postId: string, triggerId: string) {
        await this.prisma.post.update({
            where: { id: postId },
            data: {
                triggers: {
                    disconnect: { id: triggerId }
                }
            }
        });
        return { message: 'Trigger removed from post' };
    }
}