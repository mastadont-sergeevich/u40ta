import { Repository } from 'typeorm';
import { EmailAttachment } from '../../email/entities/email-attachment.entity';
import { ProcessedStatement } from '../entities/processed-statement.entity';
import { AppEventsService } from '../../app-events/app-events.service';
export declare class StatementParserService {
    private emailAttachmentRepo;
    private processedStatementRepo;
    private appEventsService;
    constructor(emailAttachmentRepo: Repository<EmailAttachment>, processedStatementRepo: Repository<ProcessedStatement>, appEventsService: AppEventsService);
    parseStatement(attachmentId: number): Promise<ProcessedStatement[]>;
    private cleanOldStatements;
    private readExcelFile;
    private createStatementRecords;
    private parseQuantity;
}
