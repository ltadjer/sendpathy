import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { CreateTherapistDto } from '../user/dto/create-therapist.dto';
import slugify from 'slugify';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() req: LoginDto, @Res() res: Response) {
    const user = await this.authService.login(req.email, req.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    res
      .cookie('access_token', user.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .cookie('refresh_token', user.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(HttpStatus.OK)
      .send({
        email: user.email,
        avatar: user.avatar,
        username: user.username,
        id: user.id,
        accessCode: user.accessCode,
        role: user.role,
      });
  }

  @Post('dashboard/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login for dashboard users (THERAPIST and ADMIN)' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async loginForDashboard(@Body() req: LoginDto, @Res() res: Response) {
    const user = await this.authService.login(req.email, req.password);
    if (!user || (user.role !== 'THERAPIST' && user.role !== 'ADMIN')) {
      throw new UnauthorizedException('Access denied');
    }
    res
      .cookie('access_token', user.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .cookie('refresh_token', user.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(HttpStatus.OK)
      .send({
        email: user.email,
        avatar: user.avatar,
        username: user.username,
        id: user.id,
        accessCode: user.accessCode,
        role: user.role,
      });
  }

  @Post('register/user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  async register(@Body() dto: CreateUserDto) {
    dto.slug = slugify(dto.username, { lower: true });
    try {
      return await this.authService.register(dto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('register/therapist')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new therapist' })
  @ApiResponse({
    status: 201,
    description: 'Therapist registered successfully.',
  })
  @ApiResponse({ status: 409, description: 'Therapist already exists.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  async registerTherapist(@Body() dto: CreateTherapistDto) {
    dto.slug = slugify(`${dto.firstName} ${dto.lastName}`, { lower: true });
    dto.role = 'THERAPIST';
    try {
      return await this.authService.register(dto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  async logout(@Req() req: any, @Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res
      .status(HttpStatus.OK)
      .send({ message: 'Logged out successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@User() user: any) {
    const u = await this.userService.findOneByEmail(user.email);
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  @Get('confirm-email')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({ summary: 'Confirm user email' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to login after confirmation.',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async confirmEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.authService.confirmEmail(token);
      return res.redirect(
        `${process.env.VITE_FRONTEND_URL}/connexion?message=confirmed`,
      );
    } catch {
      throw new BadRequestException('Failed to confirm email');
    }
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async requestPasswordReset(@Body('email') email: string) {
    const result = await this.authService.requestPasswordReset(email);
    if (!result) throw new NotFoundException('User not found');
    return { message: 'Password reset email sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.authService.resetPassword(token, newPassword);
      return { message: 'Password has been reset' };
    } catch {
      throw new BadRequestException('Failed to reset password');
    }
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refreshToken(@Req() req: any, @Res() res: Response) {
    const rt = req.cookies?.refresh_token;
    if (!rt) throw new UnauthorizedException('No refresh token');
    const { accessToken, refreshToken: newRt } =
      await this.authService.refreshToken(rt);
    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
      })
      .cookie('refresh_token', newRt, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(HttpStatus.OK)
      .send({ message: 'Token refreshed' });
  }
}
