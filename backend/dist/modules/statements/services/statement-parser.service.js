"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementParserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const XLSX = __importStar(require("xlsx"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const process = __importStar(require("process"));
const email_attachment_entity_1 = require("../../email/entities/email-attachment.entity");
const processed_statement_entity_1 = require("../entities/processed-statement.entity");
const app_events_service_1 = require("../../app-events/app-events.service");
const statement_response_dto_1 = require("../dto/statement-response.dto");
let StatementParserService = class StatementParserService {
    emailAttachmentRepo;
    processedStatementRepo;
    entityManager;
    appEventsService;
    constructor(emailAttachmentRepo, processedStatementRepo, entityManager, appEventsService) {
        this.emailAttachmentRepo = emailAttachmentRepo;
        this.processedStatementRepo = processedStatementRepo;
        this.entityManager = entityManager;
        this.appEventsService = appEventsService;
    }
    async getExistingStatements(attachmentId) {
        const entities = await this.processedStatementRepo.find({
            where: { emailAttachmentId: attachmentId },
            order: { id: 'ASC' },
        });
        return statement_response_dto_1.ProcessedStatementDto.fromEntities(entities);
    }
    async parseStatement(attachmentId) {
        const attachment = await this.emailAttachmentRepo.findOne({
            where: { id: attachmentId },
        });
        if (!attachment) {
            throw new common_1.NotFoundException(`Вложение с ID ${attachmentId} не найдено`);
        }
        if (attachment.isInventory) {
            return [];
        }
        if (attachment.inProcess) {
            return await this.getExistingStatements(attachmentId);
        }
        const filePath = this.getFilePath(attachment.filename);
        if (!fs.existsSync(filePath)) {
            throw new common_1.InternalServerErrorException(`Файл не найден: ${attachment.filename}`);
        }
        if (!attachment.sklad || !attachment.docType) {
            throw new common_1.InternalServerErrorException(`У вложения отсутствует склад (${attachment.sklad}) или тип документа (${attachment.docType})`);
        }
        let savedEntities = [];
        try {
            await this.prepareForNewStatement(attachment);
            if (attachment.docType === 'ОСВ') {
                const excelRows = this.parseOSVExcel(filePath);
                const newEntities = this.createOSVStatementsFromExcel(excelRows, attachment);
                savedEntities = await this.saveStatementsInTransaction(newEntities, attachment);
            }
            else if (attachment.docType === 'ОС') {
                const excelRows = this.parseOSExcel(filePath);
                const newEntities = this.createOSStatementsFromExcel(excelRows, attachment);
                savedEntities = await this.saveStatementsInTransaction(newEntities, attachment);
            }
            else {
                throw new common_1.InternalServerErrorException(`Неизвестный тип документа: ${attachment.docType}`);
            }
            this.appEventsService.notifyStatementActiveChanged(attachmentId, attachment.zavod, attachment.sklad);
            return statement_response_dto_1.ProcessedStatementDto.fromEntities(savedEntities);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Ошибка обработки ведомости: ${error.message}`);
        }
    }
    async prepareForNewStatement(attachment) {
        await this.entityManager.transaction(async (transactionalEntityManager) => {
            const oldStatement = await transactionalEntityManager.findOne(processed_statement_entity_1.ProcessedStatement, {
                where: {
                    sklad: attachment.sklad || '',
                    doc_type: attachment.docType || '',
                },
                select: ['emailAttachmentId'],
            });
            const oldAttachmentId = oldStatement?.emailAttachmentId;
            await transactionalEntityManager.delete(processed_statement_entity_1.ProcessedStatement, {
                sklad: attachment.sklad,
                doc_type: attachment.docType,
            });
            if (oldAttachmentId && oldAttachmentId !== attachment.id) {
                await transactionalEntityManager.update(email_attachment_entity_1.EmailAttachment, { id: oldAttachmentId }, { inProcess: false });
            }
        });
    }
    async saveStatementsInTransaction(newEntities, attachment) {
        return await this.entityManager.transaction(async (transactionalEntityManager) => {
            const createdEntities = await transactionalEntityManager.save(processed_statement_entity_1.ProcessedStatement, newEntities);
            await transactionalEntityManager.update(email_attachment_entity_1.EmailAttachment, { id: attachment.id }, { inProcess: true });
            return createdEntities;
        });
    }
    parseOSVExcel(filePath) {
        try {
            const workbook = XLSX.readFile(filePath);
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Ошибка чтения Excel файла ОСВ: ${error.message}`);
        }
    }
    parseOSExcel(filePath) {
        try {
            const workbook = XLSX.readFile(filePath);
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            const result = data.map(row => ({
                'Основное средство': row['Основное средство']?.toString(),
                'Название': row['Название']?.toString(),
                'Инвентарный номер': row['Инвентарный номер']?.toString(),
                'МОЛ': row['МОЛ']?.toString(),
            }));
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Ошибка чтения Excel файла ОС: ${error.message}`);
        }
    }
    createOSVStatementsFromExcel(excelRows, attachment) {
        const statements = [];
        for (const row of excelRows) {
            const zavod = row['Завод'] ? parseInt(row['Завод'].toString()) : 0;
            const sklad = row['Склад']?.toString() || attachment.sklad || '';
            const buhName = row['КрТекстМатериала']?.toString() || row['Материал']?.toString() || '';
            const invNumber = row['Материал']?.toString() || '';
            const partyNumber = row['Партия']?.toString() || '';
            if (!invNumber || invNumber.trim() === '') {
                continue;
            }
            let quantity = 1;
            const quantityValue = row['Запас на конец периода'];
            if (quantityValue !== undefined && quantityValue !== null) {
                const num = Number(quantityValue);
                if (!isNaN(num) && num > 0) {
                    quantity = Math.floor(num);
                }
            }
            for (let i = 0; i < quantity; i++) {
                const statement = new processed_statement_entity_1.ProcessedStatement();
                statement.emailAttachmentId = attachment.id;
                statement.sklad = sklad;
                statement.doc_type = attachment.docType || 'ОСВ';
                statement.zavod = zavod;
                statement.buh_name = buhName;
                statement.inv_number = invNumber;
                statement.party_number = partyNumber;
                statement.have_object = false;
                statement.is_ignore = false;
                statement.is_excess = false;
                statements.push(statement);
            }
        }
        return statements;
    }
    createOSStatementsFromExcel(excelRows, attachment) {
        const statements = [];
        for (const row of excelRows) {
            const buhName = row['Название']?.trim() || '';
            const invNumber = row['Инвентарный номер']?.trim() || '';
            const sklad = row['МОЛ']?.toString().trim() || attachment.sklad || '';
            if (!buhName || !invNumber || !sklad) {
                continue;
            }
            const statement = new processed_statement_entity_1.ProcessedStatement();
            statement.emailAttachmentId = attachment.id;
            statement.sklad = sklad;
            statement.doc_type = attachment.docType || 'ОС';
            statement.zavod = 0;
            statement.buh_name = buhName;
            statement.inv_number = invNumber;
            statement.party_number = '-';
            statement.have_object = false;
            statement.is_ignore = false;
            statement.is_excess = false;
            statements.push(statement);
        }
        return statements;
    }
    getFilePath(filename) {
        const projectRoot = process.cwd();
        const emailAttachmentsDir = path.join(projectRoot, '..', 'email-attachments');
        const filePath = path.join(emailAttachmentsDir, filename);
        return filePath;
    }
};
exports.StatementParserService = StatementParserService;
exports.StatementParserService = StatementParserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_attachment_entity_1.EmailAttachment)),
    __param(1, (0, typeorm_1.InjectRepository)(processed_statement_entity_1.ProcessedStatement)),
    __param(2, (0, typeorm_1.InjectEntityManager)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.EntityManager,
        app_events_service_1.AppEventsService])
], StatementParserService);
//# sourceMappingURL=statement-parser.service.js.map