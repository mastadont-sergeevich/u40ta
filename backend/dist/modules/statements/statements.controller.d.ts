import { StatementParserService } from './services/statement-parser.service';
export declare class StatementsController {
    private readonly parserService;
    constructor(parserService: StatementParserService);
    getStatement(attachmentId: number): Promise<{
        success: boolean;
        attachmentId: number;
        statements: import("./entities/processed-statement.entity").ProcessedStatement[];
        count: number;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        attachmentId: number;
        statements: never[];
        count: number;
        error: any;
        message?: undefined;
    }>;
}
