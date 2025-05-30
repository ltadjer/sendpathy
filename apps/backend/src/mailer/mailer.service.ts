import { Injectable } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class MailerService {
  private brevoClient: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    this.brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  async sendConfirmationEmail(
    email: string,
    token: string,
    role: string,
  ): Promise<boolean> {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.sender = { email: 'sendpathy@gmail.com', name: 'Sendpathy' };
    sendSmtpEmail.subject = 'Confirmation de votre inscription';
    sendSmtpEmail.htmlContent = `<html><body><h1>Merci pour votre inscription!</h1><p>Veuillez confirmer votre adresse email en cliquant sur le lien suivant: <a href="${process.env.VITE_API_URL}/auth/confirm-email?token=${token}">Confirmer</a></p></body></html>`;

    try {
      const response = await this.brevoClient.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email de confirmation:",
        error,
      );
      return false;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    role: string,
  ): Promise<boolean> {
    const baseUrl =
      role === 'USER'
        ? process.env.VITE_FRONTEND_URL + '/reset-password'
        : 'https://dashboard.sendpathy.aaa/auth/reset-password';

    const resetUrl = `${baseUrl}?token=${token}`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.sender = { email: 'sendpathy@gmail.com', name: 'Sendpathy' };
    sendSmtpEmail.subject = 'Réinitialisation de votre mot de passe';
    sendSmtpEmail.htmlContent = `<html><body><h1>Réinitialisation de votre mot de passe</h1><p>Veuillez réinitialiser votre mot de passe en cliquant sur le lien suivant: <a href="${resetUrl}">Réinitialiser</a></p></body></html>`;

    try {
      await this.brevoClient.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email de réinitialisation:",
        error,
      );
      return false;
    }
  }
}
