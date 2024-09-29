import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const confirmationToken = uuidv4();

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        confirmationToken,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id }
    });
  }

  async findByToken(token: string) {
    return await this.prisma.user.findFirst({
      where: { confirmationToken: token }
    });
  
  }
}