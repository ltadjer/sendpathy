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
  /**
   * Valide les informations d'identification de l'utilisateur.
   * @param email - L'email de l'utilisateur.
   * @param password - Le mot de passe de l'utilisateur.
   * @returns Les informations de l'utilisateur si les informations d'identification sont valides.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   * @throws UnauthorizedException si l'utilisateur n'est pas vérifié ou si les informations d'identification sont invalides.
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User not verified');
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
  /**
   * Connecte un utilisateur et génère des tokens JWT.
   * @param email - L'email de l'utilisateur.
   * @param password - Le mot de passe de l'utilisateur.
   * @returns Un objet contenant le jeton d'accès et le refresh token.
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '3600s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.userService.updateRefreshToken(user.id, refreshToken);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  /**
   * Rafraîchit le jeton d'accès en utilisant le refresh token.
   * @param token - Le refresh token.
   * @returns Un objet contenant le nouveau jeton d'accès.
   * @throws UnauthorizedException si le refresh token est invalide.
   */
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userService.findByRefreshToken(token);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newAccessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },
        { expiresIn: '3600s' },
      );
      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  /**
   * Valide les données d'enregistrement de l'utilisateur.
   * @param email - L'email de l'utilisateur.
   * @param password - Le mot de passe de l'utilisateur.
   * @throws BadRequestException si les données sont invalides.
   */
  validateRegistrationData(email: string, password: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(emailRegex.test(email));
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (password.length < 12) {
      throw new BadRequestException(
        'Password must be at least 12 characters long',
      );
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one special character',
      );
    }

    //TODO: Add more validation rules to the other fields
  }
  /**
   * Enregistre un nouvel utilisateur.
   * @param email - L'email de l'utilisateur.
   * @param password - Le mot de passe de l'utilisateur.
   * @returns Un message indiquant que l'utilisateur a été créé.
   * @throws ConflictException si l'utilisateur existe déjà.
   * @throws Error si l'envoi de l'email de confirmation échoue.
   */
  async register(data: any) {
    console.log('data', data)
    const { email, username, password, age, nativeLanguage} = data;
    this.validateRegistrationData(email, password);
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    const slug = this.generateSlug(username);
    console.log('slug', slug)
    const newUser = await this.userService.create({
      email,
      username,
      password,
      age,
      nativeLanguage,
      slug,
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
  /**
   * Confirme l'email de l'utilisateur.
   * @param token - Le token de confirmation.
   * @throws Error si le token est invalide.
   */
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
  /**
   * Demande une réinitialisation de mot de passe pour un utilisateur.
   * @param email - L'email de l'utilisateur.
   * @returns Un message indiquant que l'email de réinitialisation a été envoyé.
   * @throws Error si l'envoi de l'email de réinitialisation échoue.
   */
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
  /**
   * Réinitialise le mot de passe de l'utilisateur.
   * @param token - Le token de réinitialisation.
   * @param newPassword - Le nouveau mot de passe.
   * @returns Un message indiquant que le mot de passe a été réinitialisé.
   */
  async resetPassword(token: string, newPassword: string) {
    return await this.userService.resetPassword(token, newPassword);
  }

  /**
   * Génére un slug à partir de l'username
   * @param username 
   * @returns un slug
   */ 

  generateSlug(username: string): string {
    return username.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
}
