export declare class SmtpService {
    private transporter;
    constructor();
    sendEmail(to: string, subject: string, text: string, attachments?: any[]): Promise<{
        success: boolean;
        messageId: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
    }>;
}
