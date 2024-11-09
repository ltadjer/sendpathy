import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async findOne(id: string) {
        const post = await this.prisma.post.findUnique({
            where: { id: id },
            include: {
                comments: {
                    where: { parentId: null },
                    include: {
                        user: true,
                    },
                },
                triggers: true,
                tags: true,
                user: true,
            },
        });

        if (post) {
            post.comments = await this.fetchReplies(post.comments);
        }

        return post;
    }

    async findAll() {
        const posts = await this.prisma.post.findMany({
            include: {
                comments: {
                    where: { parentId: null },
                    include: {
                        user: true,
                    },
                },
                triggers: true,
                tags: true,
                user: true,
            },
        });

        for (const post of posts) {
            post.comments = await this.fetchReplies(post.comments);
        }

        return posts;
    }

    private async fetchReplies(comments: any[]): Promise<any[]> {
        for (const comment of comments) {
            const replies = await this.prisma.comment.findMany({
                where: { parentId: comment.id },
                include: {
                    user: true,
                },
            });

            comment.replies = await this.fetchReplies(replies);
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
        });
    }

    async update(id: string, updatePostDto: UpdatePostDto) {
        return await this.prisma.post.update({
          where: { id },
          data: updatePostDto,
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
