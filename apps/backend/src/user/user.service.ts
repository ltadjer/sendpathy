import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateTherapistDto } from './dto/create-therapist.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Trouve un utilisateur par son ID.
   * @param id - L'ID de l'utilisateur.
   * @returns L'utilisateur correspondant à l'ID.
   */
  async findOne(id: string) {
    if (!id) {
      throw new Error('User ID is required');
    }
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        friendshipsReceived: {
          include: {
            requester: {
              include: {
                friendshipsReceived: {
                  include: {
                    requester: true,
                    receiver: true,
                  },
                },
                friendshipsSent: {
                  include: {
                    requester: true,
                    receiver: true,
                  },
                },
              },
            },
          },
        },
        friendshipsSent: {
          include: {
            receiver: {
              include: {
                friendshipsReceived: {
                  include: {
                    requester: true,
                    receiver: true,
                  },
                },
                friendshipsSent: {
                  include: {
                    requester: true,
                    receiver: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Trouve un utilisateur par son email.
   * @param email - L'email de l'utilisateur.
   * @returns L'utilisateur correspondant à l'email.
   */
  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        friendshipsReceived: {
          include: {
            requester: {
              include: {
                friendshipsReceived: {
                  include: {
                    requester: true,
                    receiver: true,
                  },
                },
                friendshipsSent: {
                  include: {
                    requester: true,
                    receiver: true,
                  },
                },
              },
            },
          },
        },
        friendshipsSent: {
          include: {
            receiver: {
              include: {
                friendshipsReceived: {
                  include: {
                    requester: true,
                    receiver: true,
                  },
                },
                friendshipsSent: {
                  include: {
                    requester: true,
                    receiver: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Trouve tous les utilisateurs.
   * @returns Une liste de tous les utilisateurs.
   */
  async findAll() {
    return await this.prisma.user.findMany();
  }

  /**
   * Trouve tous les thérapeutes.
   * @returns Une liste de tous les thérapeutes.
   */

  async findAllTherapists() {
    return await this.prisma.user.findMany({
      where: { role: 'THERAPIST' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        biography: true,
        email: true,
      },
    });
  }

  /**
   * Crée un nouvel utilisateur.
   * @param createUserDto - Les données pour créer un nouvel utilisateur.
   * @returns Les informations de l'utilisateur créé sans le mot de passe.
   */
  async create(createUserDto: CreateUserDto | CreateTherapistDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const confirmationToken = uuidv4();

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        confirmationToken,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  /**
   * Met à jour un utilisateur.
   * @param id - L'ID de l'utilisateur à mettre à jour.
   * @param updateUserDto - Les nouvelles données de l'utilisateur.
   * @returns Les informations de l'utilisateur mis à jour.
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log('updateUserDto', updateUserDto)
    console.log('id', await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    }))
    await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return await this.findOne(id);
  }

  /**
   * Supprime un utilisateur.
   * @param id - L'ID de l'utilisateur à supprimer.
   * @returns Les informations de l'utilisateur supprimé.
   */
  async delete(id: string) {
    await this.prisma.user.delete({
      where: { id }
    });
    return {message: "Conversation deleted"};
  }

  /**
   * Trouve un utilisateur par son token de confirmation.
   * @param token - Le token de confirmation.
   * @returns L'utilisateur correspondant au token de confirmation.
   */
  async findByToken(token: string) {
    return await this.prisma.user.findFirst({
      where: { confirmationToken: token }
    });
  }

  /**
   * Trouve un utilisateur par son token de réinitialisation de mot de passe.
   * @param token - Le token de réinitialisation de mot de passe.
   * @returns L'utilisateur correspondant au token de réinitialisation de mot de passe.
   */
  async findByResetPasswordToken(token: string) {
    return await this.prisma.user.findFirst({
      where: { resetPasswordToken: token }
    });
  }

  /**
   * Demande une réinitialisation de mot de passe pour un utilisateur.
   * @param email - L'email de l'utilisateur.
   * @returns Le token de réinitialisation de mot de passe.
   * @throws Error si l'utilisateur n'est pas trouvé.
   */
  async requestPasswordReset(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetPasswordToken = uuidv4();
    await this.prisma.user.update({
      where: { email },
      data: { resetPasswordToken },
    });

    return resetPasswordToken;
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur.
   * @param token - Le token de réinitialisation de mot de passe.
   * @param newPassword - Le nouveau mot de passe.
   * @returns Un message indiquant que le mot de passe a été réinitialisé avec succès.
   * @throws Error si le token est invalide.
   */
  async resetPassword(token: string, newPassword: string) {
    const user = await this.findByResetPasswordToken(token);
    if (!user) {
      throw new Error('Invalid token');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetPasswordToken: null },
    });

    return { message: 'Password reset successful' };
  }

  /**
   * Met à jour le refresh token de l'utilisateur.
   * @param userId - L'ID de l'utilisateur.
   * @param refreshToken - Le nouveau refresh token.
   * @returns Les informations de l'utilisateur mis à jour.
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  /**
   * Trouve un utilisateur par son refresh token.
   * @param refreshToken - Le refresh token.
   * @returns L'utilisateur correspondant au refresh token.
   */
  async findByRefreshToken(refreshToken: string) {
    return await this.prisma.user.findFirst({ where: { refreshToken } });
  }

  async updateAccessCode(userId: string, accessCode: string) {
    const salt = await bcrypt.genSalt();
    const hashedAccessCode = await bcrypt.hash(accessCode, salt);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { accessCode: hashedAccessCode },
    });
    return user.accessCode;
  }

  async validateAccessCode(userId: string, accessCode: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { accessCode: true },
    });

    if (!user || !(await bcrypt.compare(accessCode, user.accessCode))) {
      return false;
    }
    return true;
  }

}