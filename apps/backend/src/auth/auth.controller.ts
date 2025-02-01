import { Controller, Post, Body, Get, Query, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateTherapistDto } from 'src/user/dto/create-therapist.dto';
import slugify from 'slugify';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/decorators/user.decorator';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  /**
   * Logs in a user and returns JWT tokens.
   * @param req - The login request data.
   * @param res
   */
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() req: LoginDto, @Res() res: Response) {
    const user = await this.authService.login(req.email, req.password);
    res.cookie('access_token', user.access_token, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', user.refresh_token, { httpOnly: true, secure: true});
    // ne pas envoyer les tokens, mais le reste des données de l'utilisateur
    return res.send({ email: user.email, avatar: user.avatar, username: user.username,});
  }
  /**
   * Registers a new user.
   * @param createUserDto - The data transfer object containing user details.
   */
  @Post('register/user')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: any) {
    createUserDto.slug = slugify(createUserDto.username, { lower: true });
    return await this.authService.register(createUserDto);
  }

 //TODO: Add a route to logout a user
  @Post('logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  async logout(@Req() req: any, @Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.send({ message: 'Logged out successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@User() user: any) {
    console.log('user', user);
    const updatedUser = await this.userService.findOneByEmail(user.email);
    console.log('updatedUser', updatedUser);
    return {
      email: updatedUser.email,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
    };
  }

  /**
   * Registers a new therapist.
   * @param createTherapistDto - The data transfer object containing therapist details.
   */
  @Post('register/therapist')
  @ApiOperation({ summary: 'Register a new therapist' })
  @ApiResponse({ status: 201, description: 'Therapist registered successfully.' })
  @ApiResponse({ status: 409, description: 'Therapist already exists.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreateTherapistDto })
  async registerTherapist(@Body() createTherapistDto: CreateTherapistDto) {
    createTherapistDto.slug = slugify(`${createTherapistDto.firstName} ${createTherapistDto.lastName}`, { lower: true });
    createTherapistDto.role = 'THERAPIST';
    return await this.authService.register(createTherapistDto);
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
    return await this.authService.requestPasswordReset(email);
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
    return await this.authService.resetPassword(token, newPassword);
  }

  /**
   * Refreshes the JWT token using a refresh token.
   * @param req - The request object.
   * @param res - The response object.
   */
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refreshToken(@Req() req: any, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshToken(refreshToken);
    res.cookie('access_token', accessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', newRefreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.send({ message: 'Token refreshed' });
  }
}