export declare class EmailFileAnalyzer {
    analyzeExcel(filePath: string): Promise<{
        isValid: boolean;
        docType?: string;
        sklad?: string;
        error?: string;
    }>;
}
