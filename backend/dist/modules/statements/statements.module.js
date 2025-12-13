"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_auth_module_1 = require("../auth/jwt-auth.module");
const app_events_module_1 = require("../app-events/app-events.module");
const statements_controller_1 = require("./statements.controller");
const statement_parser_service_1 = require("./services/statement-parser.service");
const processed_statement_entity_1 = require("./entities/processed-statement.entity");
const email_attachment_entity_1 = require("../email/entities/email-attachment.entity");
let StatementsModule = class StatementsModule {
};
exports.StatementsModule = StatementsModule;
exports.StatementsModule = StatementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([processed_statement_entity_1.ProcessedStatement]),
            typeorm_1.TypeOrmModule.forFeature([email_attachment_entity_1.EmailAttachment,]),
            app_events_module_1.AppEventsModule,
            jwt_auth_module_1.JwtAuthModule,
        ],
        controllers: [statements_controller_1.StatementsController],
        providers: [statement_parser_service_1.StatementParserService],
        exports: [statement_parser_service_1.StatementParserService]
    })
], StatementsModule);
//# sourceMappingURL=statements.module.js.map