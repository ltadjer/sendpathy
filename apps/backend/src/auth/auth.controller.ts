import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Logs in a user and returns JWT tokens.
   * @param req - The login request data.
   */
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginDto })
  async login(@Body() req: LoginDto) {
    return this.authService.login(req.email, req.password);
  }

  /**
   * Registers a new user.
   * @param createUserDto - The data transfer object containing user details.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /**
   * Confirms a user's email.
   * @param token - The email confirmation token.
   * @param res - The response object.
   */
  @Get('confirm-email')
  @ApiOperation({ summary: 'Confirm user email' })
  @ApiResponse({ status: 200, description: 'Email confirmed successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to confirm email.' })
  async confirmEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      console.log('token', token);
      await this.authService.confirmEmail(token);
      return res.redirect('https://sendpathy.aaa/connexion?message=email_confirmed');
    } catch (error) {
      return res.status(400).send({ message: 'Failed to confirm' });
    }
  }

  /**
   * Requests a password reset for a user.
   * @param email - The email of the user.
   */
  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 400, description: 'Failed to send password reset email.' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string', description: 'Email of the user' } } } })
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  /**
   * Resets a user's password.
   * @param token - The password reset token.
   * @param newPassword - The new password.
   */
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to reset password.' })
  @ApiBody({ schema: { type: 'object', properties: { token: { type: 'string', description: 'Reset token' }, newPassword: { type: 'string', description: 'New password' } } } })
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword);
  }

  /**
   * Refreshes the JWT token using a refresh token.
   * @param refreshTokenDto - The data transfer object containing the refresh token.
   */
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}