import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User not verified');
    }
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateRegistrationData(email: string, password: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(emailRegex.test(email));
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
    if (password.length < 12) {
      throw new BadRequestException('Password must be at least 12 characters long');
    }
    //TODO: Add more validation rules to the other fields 
  }

  async register(email: string, password: string) {
    this.validateRegistrationData(email, password);
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userService.create({
      email: email,
      password: hashedPassword,
    });
    const emailSent = await this.mailerService.sendConfirmationEmail(
      email,
      newUser.confirmationToken,
    );
    if (!emailSent) {
      throw new Error('Failed to send confirmation email');
    }
    return { message: 'User created' };
  }

  async confirmEmail(token: string) {
    // Récupérer l'utilisateur correspondant au token
    const user = await this.userService.findByToken(token);
    if (!user) {
      throw new Error('Invalid token');
    }

    // Sauvegarder les modifications
    await this.userService.update(user.id, {
      isActive: true,
      confirmationToken: null,
    });
  }

  async requestPasswordReset(email: string) {
    const resetToken = await this.userService.requestPasswordReset(email);
    const emailSent = await this.mailerService.sendPasswordResetEmail(
      email,
      resetToken,
    );
    if (!emailSent) {
      throw new Error('Failed to send password reset email');
    }
    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    return await this.userService.resetPassword(token, newPassword);
  }
}
