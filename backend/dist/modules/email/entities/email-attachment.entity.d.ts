import { ProcessedStatement } from '../../statements/entities/processed-statement.entity';
export declare class EmailAttachment {
    id: number;
    filename: string;
    emailFrom: string | null;
    receivedAt: Date;
    docType: string | null;
    zavod: number;
    sklad: string | null;
    inProcess: boolean;
    isInventory: boolean;
    processedStatements: ProcessedStatement[];
}
