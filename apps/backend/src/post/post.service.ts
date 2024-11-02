import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async findOne(id: string) {
        return this.prisma.post.findUnique({
            where: { id: id }
        })
    }

    async findAll() {
        return this.prisma.post.findMany();
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
        return this.prisma.post.update({
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
        return this.prisma.post.update({
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
        return this.prisma.post.update({
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
