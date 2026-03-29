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
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const config_1 = require("@nestjs/config");
const email_attachments_service_1 = require("./services/email-attachments.service");
const imap_service_1 = require("./services/imap.service");
const email_attachment_response_dto_1 = require("./dto/email-attachment-response.dto");
let EmailController = class EmailController {
    imapService;
    emailAttachmentsService;
    configService;
    constructor(imapService, emailAttachmentsService, configService) {
        this.imapService = imapService;
        this.emailAttachmentsService = emailAttachmentsService;
        this.configService = configService;
    }
    async checkEmailNow() {
        try {
            await this.imapService.checkForNewEmails();
            return { success: true, message: 'Проверка почты завершена' };
        }
        catch (error) {
            return { success: false, message: `Ошибка проверки почты: ${error.message}` };
        }
    }
    async getAllAttachments(request) {
        const userId = request.user?.sub;
        if (!userId)
            return [];
        const attachments = await this.emailAttachmentsService.getAttachmentsForUser(userId);
        return attachments.map(this.toResponseDto);
    }
    async deleteAttachment(id, request) {
        const userId = request.user?.sub;
        if (!userId) {
            return { success: false, message: 'Пользователь не аутентифицирован' };
        }
        try {
            await this.emailAttachmentsService.deleteAttachment(id, userId);
            return {
                success: true,
                message: 'Вложение успешно удалено',
                attachmentId: id,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Ошибка при удалении вложения',
                attachmentId: id,
                error: error.message,
            };
        }
    }
    toResponseDto(attachment) {
        const dto = new email_attachment_response_dto_1.EmailAttachmentResponseDto();
        dto.id = attachment.id;
        dto.filename = attachment.filename;
        dto.emailFrom = attachment.emailFrom;
        dto.receivedAt = attachment.receivedAt;
        dto.docType = attachment.docType;
        dto.zavod = attachment.zavod;
        dto.sklad = attachment.sklad;
        dto.inProcess = attachment.inProcess;
        dto.isInventory = attachment.isInventory;
        return dto;
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Post)('check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "checkEmailNow", null);
__decorate([
    (0, common_1.Get)('attachments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getAllAttachments", null);
__decorate([
    (0, common_1.Delete)('attachments/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "deleteAttachment", null);
exports.EmailController = EmailController = __decorate([
    (0, common_1.Controller)('email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [imap_service_1.ImapService,
        email_attachments_service_1.EmailAttachmentsService,
        config_1.ConfigService])
], EmailController);
//# sourceMappingURL=email.controller.js.map