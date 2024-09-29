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
      console.log('token', token);
      await this.authService.confirmEmail(token);
      return res.redirect('https://sendpathy.aaa/login?message=email_confirmed');
    } catch (error) {
      return res.status(400).send({ message: 'Failed to confirm' });
    }
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword);
  }
}