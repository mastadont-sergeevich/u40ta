import { StatementService } from './services/statement.service';
import { StatementObjectsService } from './services/statement-objects.service';
import { StatementResponseDto } from './dto/statement-response.dto';
import { UpdateIgnoreDto } from './dto/update-ignore.dto';
import { UpdateHaveObjectDto } from './dto/update-have-object.dto';
import { ProcessedStatementDto } from './dto/statement-response.dto';
export declare class StatementsController {
    private readonly statementService;
    private readonly statementObjectsService;
    constructor(statementService: StatementService, statementObjectsService: StatementObjectsService);
    findByInv(inv: string, zavod?: string, sklad?: string): Promise<{
        success: boolean;
        statements: ProcessedStatementDto[];
        count: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        statements: never[];
        count?: undefined;
    }>;
    getStatement(attachmentId: number): Promise<StatementResponseDto>;
    updateIgnoreStatus(dto: UpdateIgnoreDto): Promise<StatementResponseDto>;
    updateHaveObject(dto: UpdateHaveObjectDto): Promise<void>;
}
