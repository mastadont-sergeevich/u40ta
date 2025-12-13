import { Repository } from 'typeorm';
import { EmailAttachment } from '../entities/email-attachment.entity';
import { AppEventsService } from '../../app-events/app-events.service';
import { SmtpService } from './smtp.service';
import { EmailFileAnalyzer } from './email-file-analyzer.service';
export declare class EmailProcessor {
    private attachmentsRepo;
    private appEventsService;
    private smtpService;
    private emailFileAnalyzer;
    constructor(attachmentsRepo: Repository<EmailAttachment>, appEventsService: AppEventsService, smtpService: SmtpService, emailFileAnalyzer: EmailFileAnalyzer);
    analyzeAndSaveAttachment(filePath: string, filename: string, emailFrom: string, emailSubject?: string): Promise<EmailAttachment | null>;
}
