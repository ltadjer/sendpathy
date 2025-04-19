export declare class MailerService {
    private brevoClient;
    constructor();
    sendConfirmationEmail(email: string, token: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, token: string): Promise<boolean>;
}
