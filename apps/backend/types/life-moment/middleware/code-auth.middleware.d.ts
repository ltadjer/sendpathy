import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class CodeAuthMiddleware implements NestMiddleware {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
