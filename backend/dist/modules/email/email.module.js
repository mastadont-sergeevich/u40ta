"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_auth_module_1 = require("../auth/jwt-auth.module");
const app_events_module_1 = require("../app-events/app-events.module");
const imap_service_1 = require("./services/imap.service");
const smtp_service_1 = require("./services/smtp.service");
const email_processor_service_1 = require("./services/email-processor.service");
const email_file_analyzer_service_1 = require("./services/email-file-analyzer.service");
const email_attachment_entity_1 = require("./entities/email-attachment.entity");
const email_controller_1 = require("./email.controller");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([email_attachment_entity_1.EmailAttachment]),
            app_events_module_1.AppEventsModule,
            jwt_auth_module_1.JwtAuthModule,
        ],
        controllers: [email_controller_1.EmailController],
        providers: [imap_service_1.ImapService, smtp_service_1.SmtpService, email_processor_service_1.EmailProcessor, email_file_analyzer_service_1.EmailFileAnalyzer],
        exports: [imap_service_1.ImapService, smtp_service_1.SmtpService, email_processor_service_1.EmailProcessor, email_file_analyzer_service_1.EmailFileAnalyzer]
    })
], EmailModule);
//# sourceMappingURL=email.module.js.map