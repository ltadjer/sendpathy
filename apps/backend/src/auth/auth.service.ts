import { Injectable, ConflictException } from '@nestjs/common';
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
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    const newUser = await this.userService.create({ email: email, password: password });
    const emailSent = await this.mailerService.sendConfirmationEmail(email, newUser.confirmationToken); // Envoyer l'email de confirmation
    if (!emailSent) {
      throw new Error('Failed to send confirmation email');
    }
    return { message: 'User created' };
  }

  async confirmEmail(token: string) {
    return this.userService.confirmEmail(token);
  }
}