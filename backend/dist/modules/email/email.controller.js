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
const imap_service_1 = require("./services/imap.service");
const typeorm_1 = require("typeorm");
const email_attachment_entity_1 = require("./entities/email-attachment.entity");
const typeorm_2 = require("@nestjs/typeorm");
let EmailController = class EmailController {
    imapService;
    emailAttachmentRepository;
    constructor(imapService, emailAttachmentRepository) {
        this.imapService = imapService;
        this.emailAttachmentRepository = emailAttachmentRepository;
    }
    async checkEmailNow() {
        try {
            console.log('🔄 Ручная проверка почты...');
            await this.imapService.checkForNewEmails();
            return {
                success: true,
                message: 'Проверка почты завершена'
            };
        }
        catch (error) {
            console.error('❌ Ошибка ручной проверки почты:', error);
            return {
                success: false,
                message: 'Ошибка проверки почты: ' + error.message
            };
        }
    }
    async getAllAttachments(request) {
        console.log('📄 Запрос списка email-вложений...');
        const userRole = request.user?.role;
        if (!userRole) {
            console.log('⛔ Пользователь без роли');
            return [];
        }
        if (userRole !== 'admin' && userRole !== 'МОЛ') {
            console.log(`⛔ Доступ запрещён для роли: ${userRole}`);
            return [];
        }
        const query = this.emailAttachmentRepository.createQueryBuilder('attachment');
        if (userRole === 'МОЛ') {
            query.where('attachment.doc_type IN (:...types)', {
                types: ['ОСВ', 'ОС']
            });
            console.log('🔹 Фильтр для МОЛ: только ОСВ и ОС');
        }
        else {
            console.log('🔹 Админ: все файлы');
        }
        const attachments = await query
            .orderBy('attachment.received_at', 'DESC')
            .getMany();
        console.log(`✅ Найдено записей: ${attachments.length}`);
        return attachments;
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Post)('check-now'),
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
exports.EmailController = EmailController = __decorate([
    (0, common_1.Controller)('email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, typeorm_2.InjectRepository)(email_attachment_entity_1.EmailAttachment)),
    __metadata("design:paramtypes", [imap_service_1.ImapService,
        typeorm_1.Repository])
], EmailController);
//# sourceMappingURL=email.controller.js.map