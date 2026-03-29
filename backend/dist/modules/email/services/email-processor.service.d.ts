import { Repository } from 'typeorm';
import { EmailAttachment } from '../entities/email-attachment.entity';
import { AppEventsService } from '../../app-events/app-events.service';
import { SmtpService } from './smtp.service';
import { EmailFileAnalyzer } from './email-file-analyzer.service';
import { EmailStorageService } from './email-storage.service';
import { LogsService } from '../../logs/logs.service';
export declare class EmailProcessor {
    private attachmentsRepo;
    private appEventsService;
    private smtpService;
    private emailFileAnalyzer;
    private emailStorageService;
    private logsService;
    private readonly logger;
    constructor(attachmentsRepo: Repository<EmailAttachment>, appEventsService: AppEventsService, smtpService: SmtpService, emailFileAnalyzer: EmailFileAnalyzer, emailStorageService: EmailStorageService, logsService: LogsService);
    analyzeAndSaveAttachment(fileContent: Buffer, originalFilename: string, emailFrom: string, emailSubject?: string): Promise<EmailAttachment | null>;
    private saveValidAttachment;
    private handleInvalidAttachment;
    private handleProcessingError;
}
