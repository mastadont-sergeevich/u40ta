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
const statement_service_1 = require("./services/statement.service");
const statement_parser_service_1 = require("./services/statement-parser.service");
const statement_objects_service_1 = require("./services/statement-objects.service");
const processed_statement_entity_1 = require("./entities/processed-statement.entity");
const email_attachment_entity_1 = require("../email/entities/email-attachment.entity");
const object_entity_1 = require("../objects/entities/object.entity");
let StatementsModule = class StatementsModule {
};
exports.StatementsModule = StatementsModule;
exports.StatementsModule = StatementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                processed_statement_entity_1.ProcessedStatement,
                email_attachment_entity_1.EmailAttachment,
                object_entity_1.InventoryObject,
            ]),
            app_events_module_1.AppEventsModule,
            jwt_auth_module_1.JwtAuthModule,
        ],
        controllers: [statements_controller_1.StatementsController],
        providers: [statement_service_1.StatementService, statement_parser_service_1.StatementParserService, statement_objects_service_1.StatementObjectsService],
        exports: [statement_service_1.StatementService, statement_objects_service_1.StatementObjectsService],
    })
], StatementsModule);
//# sourceMappingURL=statements.module.js.map