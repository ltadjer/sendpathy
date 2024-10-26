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
        const post = await this.prisma.post.create({
            data: {
                ...createPostDto,
                user: { connect: { id: userId } },
            },
        });
        return post;
    }

    async update(id: string, updatePostDto: UpdatePostDto) {
        return this.prisma.post.update({
          where: { id },
          data: updatePostDto,
        });
      }
    

    async delete(id: string) {
        return this.prisma.post.delete({
            where: { id: id }
          });
    }
}
