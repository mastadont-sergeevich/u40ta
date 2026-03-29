"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_attachment_entity_1 = require("../entities/email-attachment.entity");
const app_events_service_1 = require("../../app-events/app-events.service");
const smtp_service_1 = require("./smtp.service");
const email_file_analyzer_service_1 = require("./email-file-analyzer.service");
const email_storage_service_1 = require("./email-storage.service");
const logs_service_1 = require("../../logs/logs.service");
let EmailProcessor = class EmailProcessor {
    attachmentsRepo;
    appEventsService;
    smtpService;
    emailFileAnalyzer;
    emailStorageService;
    logsService;
    logger = new common_1.Logger(email_file_analyzer_service_1.EmailFileAnalyzer.name);
    constructor(attachmentsRepo, appEventsService, smtpService, emailFileAnalyzer, emailStorageService, logsService) {
        this.attachmentsRepo = attachmentsRepo;
        this.appEventsService = appEventsService;
        this.smtpService = smtpService;
        this.emailFileAnalyzer = emailFileAnalyzer;
        this.emailStorageService = emailStorageService;
        this.logsService = logsService;
    }
    async analyzeAndSaveAttachment(fileContent, originalFilename, emailFrom, emailSubject) {
        this.logger.log(`Обрабатываем вложение: ${originalFilename}`);
        const isInventory = emailSubject?.toLowerCase().includes('инвентаризац') || false;
        try {
            const { filePath, uniqueFilename } = await this.emailStorageService.saveFile(originalFilename, fileContent);
            const analysis = await this.emailFileAnalyzer.analyzeExcel(filePath);
            if (analysis.isValid) {
                return await this.saveValidAttachment(uniqueFilename, emailFrom, analysis, isInventory);
            }
            await this.handleInvalidAttachment(uniqueFilename, emailFrom, analysis.error);
            return null;
        }
        catch (error) {
            await this.handleProcessingError(originalFilename, emailFrom, error);
            throw error;
        }
    }
    async saveValidAttachment(filename, emailFrom, analysis, isInventory) {
        const attachmentData = {
            filename: filename,
            emailFrom: emailFrom,
            receivedAt: new Date(),
            docType: analysis.docType,
            zavod: analysis.zavod,
            sklad: analysis.sklad,
            isInventory: isInventory,
            inProcess: false
        };
        const savedRecord = await this.attachmentsRepo.save(attachmentData);
        this.appEventsService.notifyStatementLoaded();
        this.logger.log(`Файл принят: ${filename}`);
        this.logsService.log('backend', null, {
            action: 'email_attachment_accepted',
            filename: filename,
            emailFrom: emailFrom,
            docType: analysis.docType,
            zavod: analysis.zavod,
            sklad: analysis.sklad,
            isInventory: isInventory
        });
        const acceptText = `Ваш файл "${filename}" принят.\n\n` +
            `Тип документа: ${analysis.docType}\n` +
            `Склад: ${analysis.sklad}\n\n`;
        await this.smtpService.sendEmail(emailFrom, `Файл принят: ${filename}`, acceptText);
        return savedRecord;
    }
    async handleInvalidAttachment(filename, emailFrom, errorMessage) {
        this.logger.log(`Файл отклонён: ${filename}, причина: ${errorMessage}`);
        this.logsService.log('backend', null, {
            action: 'email_attachment_rejected',
            filename: filename,
            emailFrom: emailFrom,
            reason: errorMessage
        });
        try {
            await this.emailStorageService.deleteFile(filename);
            this.logger.log(`Файл удалён: ${filename}`);
        }
        catch (deleteError) {
            this.logger.log('Ошибка удаления файла:', deleteError);
        }
        const rejectText = `Извините, Ваш файл "${filename}" не принят.\n\n` +
            `Причина: ${errorMessage}\n\n`;
        await this.smtpService.sendEmail(emailFrom, `Файл отклонён: ${filename}`, rejectText);
    }
    async handleProcessingError(filename, emailFrom, error) {
        this.logger.log(`Ошибка обработки файла ${filename}:`, error);
        this.logsService.log('backend', null, {
            action: 'email_processing_error',
            filename: filename,
            emailFrom: emailFrom,
            error: error.message,
            stack: error.stack
        });
        const errorText = `При обработке вашего файла "${filename}" возникла непредвиденная ошибка.\n\n` +
            `Ошибка: ${error.message}\n\n`;
        await this.smtpService.sendEmail(emailFrom, `Ошибка обработки файла: ${filename}`, errorText);
    }
};
exports.EmailProcessor = EmailProcessor;
exports.EmailProcessor = EmailProcessor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_attachment_entity_1.EmailAttachment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        app_events_service_1.AppEventsService,
        smtp_service_1.SmtpService,
        email_file_analyzer_service_1.EmailFileAnalyzer,
        email_storage_service_1.EmailStorageService,
        logs_service_1.LogsService])
], EmailProcessor);
//# sourceMappingURL=email-processor.service.js.map