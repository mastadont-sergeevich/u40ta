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
const email_attachment_entity_1 = require("../../email/entities/email-attachment.entity");
const processed_statement_entity_1 = require("../entities/processed-statement.entity");
const app_events_service_1 = require("../../app-events/app-events.service");
let StatementParserService = class StatementParserService {
    emailAttachmentRepo;
    processedStatementRepo;
    appEventsService;
    constructor(emailAttachmentRepo, processedStatementRepo, appEventsService) {
        this.emailAttachmentRepo = emailAttachmentRepo;
        this.processedStatementRepo = processedStatementRepo;
        this.appEventsService = appEventsService;
    }
    async parseStatement(attachmentId) {
        const attachment = await this.emailAttachmentRepo.findOne({
            where: { id: attachmentId }
        });
        if (!attachment) {
            throw new common_1.NotFoundException(`Вложение с ID ${attachmentId} не найдено`);
        }
        if (!attachment.in_process) {
            console.log(`🔄 Первое открытие ведомости ${attachmentId}`);
            await this.cleanOldStatements(attachment);
            const excelRows = await this.readExcelFile(attachment.filename);
            const createdStatements = await this.createStatementRecords(excelRows, attachment);
            await this.emailAttachmentRepo.update(attachmentId, { in_process: true });
            this.appEventsService.notifyAll();
            console.log(`✅ Создано ${createdStatements.length} записей`);
            return createdStatements;
        }
        console.log(`📄 Возвращаем существующие записи ведомости ${attachmentId}`);
        return await this.processedStatementRepo.find({
            where: { emailAttachmentId: attachmentId },
            order: { id: 'ASC' }
        });
    }
    async cleanOldStatements(attachment) {
        if (!attachment.sklad || !attachment.doc_type) {
            return;
        }
        console.log(`🗑️ Удаление старых записей склада ${attachment.sklad}, тип ${attachment.doc_type}`);
        await this.processedStatementRepo.delete({
            sklad: attachment.sklad,
            doc_type: attachment.doc_type,
            emailAttachmentId: (0, typeorm_2.Not)(attachment.id)
        });
    }
    async readExcelFile(filename) {
        const emailAttachmentsDir = path.join(process.cwd(), '..', 'email-attachments');
        const filePath = path.join(emailAttachmentsDir, filename);
        console.log(`📖 Чтение файла: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Файл ${filename} не найден в папке email-attachments`);
        }
        try {
            const workbook = XLSX.readFile(filePath);
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            console.log(`📊 Прочитано ${data.length} строк из Excel`);
            return data;
        }
        catch (error) {
            throw new Error(`Ошибка чтения Excel файла: ${error.message}`);
        }
    }
    async createStatementRecords(excelRows, attachment) {
        const createdStatements = [];
        console.log(`🔨 Создание записей для ${excelRows.length} строк Excel`);
        for (const row of excelRows) {
            const zavod = row['Завод']?.toString() || '';
            const sklad = row['Склад']?.toString() || attachment.sklad || '';
            const buhName = row['КрТекстМатериала']?.toString() || row['Материал']?.toString() || '';
            const invNumber = row['Материал']?.toString() || '';
            const partyNumber = row['Партия']?.toString() || '';
            const quantity = this.parseQuantity(row['Запас на конец периода']);
            for (let i = 0; i < quantity; i++) {
                const statement = this.processedStatementRepo.create({
                    emailAttachmentId: attachment.id,
                    sklad: sklad,
                    doc_type: attachment.doc_type || 'ОСВ',
                    zavod: zavod,
                    inv_number: invNumber,
                    party_number: partyNumber,
                    buh_name: buhName,
                    have_object: false,
                    is_ignore: false
                });
                createdStatements.push(statement);
            }
        }
        return await this.processedStatementRepo.save(createdStatements);
    }
    parseQuantity(value) {
        if (value === undefined || value === null || value === '') {
            return 1;
        }
        const num = Number(value);
        if (isNaN(num) || num <= 0) {
            return 1;
        }
        return Math.floor(num);
    }
};
exports.StatementParserService = StatementParserService;
exports.StatementParserService = StatementParserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_attachment_entity_1.EmailAttachment)),
    __param(1, (0, typeorm_1.InjectRepository)(processed_statement_entity_1.ProcessedStatement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        app_events_service_1.AppEventsService])
], StatementParserService);
//# sourceMappingURL=statement-parser.service.js.map