import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CodeAuthMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Récupère le header d'autorisation et le code d'accès depuis les headers de la requête
    const authHeader = req.headers['authorization'];
    const accessCode = req.headers['x-access-code'];

    // Vérifie si le header d'autorisation est présent
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    // Extrait le token du header d'autorisation
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    let payload;
    try {
      // Vérifie et décode le token JWT
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    // Récupère l'ID de l'utilisateur depuis le payload du token
    const userId = payload.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    // Cherche l'utilisateur dans la base de données
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Vérifie si l'utilisateur existe
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Vérifie si le code d'accès de l'utilisateur correspond à celui fourni dans les headers
    if (user.accessCode && user.accessCode !== accessCode) {
      throw new UnauthorizedException('Invalid access code');
    }

    // Ajoute l'utilisateur à l'objet de requête pour une utilisation ultérieure
    req.user = user;

    // Passe à la prochaine fonction middleware ou au contrôleur
    next();
  }
}