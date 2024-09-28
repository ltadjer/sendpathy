import { Controller, Post, Body, UseGuards, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
    return this.authService.login(req);
  }

  @Post('register')
  async register(@Body() req) {
    return this.authService.register(req.email, req.password);
  }

  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.authService.confirmEmail(token);
      //regiriger vers le login avec un message disant que l'email a été confirmé
      res.redirect('https://sendpathy.aaa/api/login');
 
    } catch (error) {
      return { message: 'Failed to confirm' };
    }
  }
}