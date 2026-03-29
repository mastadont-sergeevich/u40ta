import { ConfigService } from '@nestjs/config';
export declare class SmtpService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
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
