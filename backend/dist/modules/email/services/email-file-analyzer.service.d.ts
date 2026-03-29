import { LogsService } from '../../logs/logs.service';
export declare class EmailFileAnalyzer {
    private readonly logsService;
    private readonly osvColumns;
    private readonly osColumns;
    constructor(logsService: LogsService);
    analyzeExcel(filePath: string): Promise<{
        isValid: boolean;
        docType?: string;
        zavod?: number;
        sklad?: string;
        error?: string;
    }>;
    private hasRequiredColumns;
    private analyzeOsvDocument;
    private analyzeOsDocument;
}
