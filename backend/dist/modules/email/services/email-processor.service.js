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
exports.EmailProcessor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs = __importStar(require("fs"));
const email_attachment_entity_1 = require("../entities/email-attachment.entity");
const app_events_service_1 = require("../../app-events/app-events.service");
const smtp_service_1 = require("./smtp.service");
const email_file_analyzer_service_1 = require("./email-file-analyzer.service");
let EmailProcessor = class EmailProcessor {
    attachmentsRepo;
    appEventsService;
    smtpService;
    emailFileAnalyzer;
    constructor(attachmentsRepo, appEventsService, smtpService, emailFileAnalyzer) {
        this.attachmentsRepo = attachmentsRepo;
        this.appEventsService = appEventsService;
        this.smtpService = smtpService;
        this.emailFileAnalyzer = emailFileAnalyzer;
    }
    async analyzeAndSaveAttachment(filePath, filename, emailFrom, emailSubject) {
        console.log(`🔄 Обрабатываем вложение: ${filename}`);
        const isInventory = emailSubject?.toLowerCase().includes('инвентаризац') || false;
        try {
            const analysis = await this.emailFileAnalyzer.analyzeExcel(filePath);
            if (analysis.isValid) {
                const attachmentData = {
                    filename: filename,
                    email_from: emailFrom,
                    received_at: new Date(),
                    doc_type: analysis.docType,
                    sklad: analysis.sklad,
                    is_inventory: isInventory
                };
                const savedRecord = await this.attachmentsRepo.save(attachmentData);
                this.appEventsService.notifyAll();
                console.log(`✅ Файл принят: ${filename}`);
                console.log('📡 SSE: отправлено обновление списка файлов');
                const acceptText = `Ваш файл "${filename}" принят.\n\n` +
                    `Тип документа: ${analysis.docType}\n` +
                    `Склад: ${analysis.sklad}\n\n`;
                await this.smtpService.sendEmail(emailFrom, `✅ Файл принят: ${filename}`, acceptText);
                return savedRecord;
            }
            else {
                console.log(`❌ Файл отклонён: ${filename}, причина: ${analysis.error}`);
                const rejectText = `❌ Извините, Ваш файл "${filename}" не принят.\n\n` +
                    `Причина: ${analysis.error}\n\n`;
                await this.smtpService.sendEmail(emailFrom, `❌ Файл отклонён: ${filename}`, rejectText);
                try {
                    fs.unlinkSync(filePath);
                    console.log(`🗑️ Файл удалён: ${filePath}`);
                }
                catch (deleteError) {
                    console.error('Ошибка удаления файла:', deleteError);
                }
                return null;
            }
        }
        catch (error) {
            console.error(`💥 Ошибка обработки файла ${filename}:`, error);
            const errorText = `При обработке вашего файла "${filename}" возникла непредвиденная ошибка.\n\n` +
                `Ошибка: ${error.message}\n\n`;
            await this.smtpService.sendEmail(emailFrom, `⚠️ Ошибка обработки файла: ${filename}`, errorText);
            throw error;
        }
    }
};
exports.EmailProcessor = EmailProcessor;
exports.EmailProcessor = EmailProcessor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_attachment_entity_1.EmailAttachment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        app_events_service_1.AppEventsService,
        smtp_service_1.SmtpService,
        email_file_analyzer_service_1.EmailFileAnalyzer])
], EmailProcessor);
//# sourceMappingURL=email-processor.service.js.map