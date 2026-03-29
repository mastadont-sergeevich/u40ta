import { EntityManager, Repository } from 'typeorm';
import { EmailAttachment } from '../../email/entities/email-attachment.entity';
import { ProcessedStatement } from '../entities/processed-statement.entity';
import { AppEventsService } from '../../app-events/app-events.service';
import { ProcessedStatementDto } from '../dto/statement-response.dto';
export declare class StatementParserService {
    private emailAttachmentRepo;
    private processedStatementRepo;
    private entityManager;
    private appEventsService;
    constructor(emailAttachmentRepo: Repository<EmailAttachment>, processedStatementRepo: Repository<ProcessedStatement>, entityManager: EntityManager, appEventsService: AppEventsService);
    getExistingStatements(attachmentId: number): Promise<ProcessedStatementDto[]>;
    parseStatement(attachmentId: number): Promise<ProcessedStatementDto[]>;
    private prepareForNewStatement;
    private saveStatementsInTransaction;
    private parseOSVExcel;
    private parseOSExcel;
    private createOSVStatementsFromExcel;
    private createOSStatementsFromExcel;
    private getFilePath;
}
