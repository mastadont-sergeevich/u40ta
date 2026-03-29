import { ConfigService } from '@nestjs/config';
import { EmailProcessor } from './email-processor.service';
import { LogsService } from '../../logs/logs.service';
export declare class ImapService {
    private emailProcessor;
    private configService;
    private logsService;
    private imap;
    private readonly logger;
    constructor(emailProcessor: EmailProcessor, configService: ConfigService, logsService: LogsService);
    checkForNewEmails(): Promise<void>;
    private processNewEmails;
    private processEmailsSequentially;
    private processEmail;
    private handleParsedEmail;
    private processAttachment;
}
