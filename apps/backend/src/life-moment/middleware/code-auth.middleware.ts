import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CodeAuthMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const accessCode = req.headers['x-access-code'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = payload.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.accessCode && user.accessCode !== accessCode) {
      throw new UnauthorizedException('Invalid access code');
    }

    // Set the user in the request object
    req.user = user;

    next();
  }
}