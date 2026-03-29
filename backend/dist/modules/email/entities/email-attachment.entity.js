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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAttachment = void 0;
const typeorm_1 = require("typeorm");
const processed_statement_entity_1 = require("../../statements/entities/processed-statement.entity");
let EmailAttachment = class EmailAttachment {
    id;
    filename;
    emailFrom;
    receivedAt;
    docType;
    zavod;
    sklad;
    inProcess;
    isInventory;
    processedStatements;
};
exports.EmailAttachment = EmailAttachment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmailAttachment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], EmailAttachment.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true, name: 'email_from' }),
    __metadata("design:type", Object)
], EmailAttachment.prototype, "emailFrom", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'received_at' }),
    __metadata("design:type", Date)
], EmailAttachment.prototype, "receivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true, name: 'doc_type' }),
    __metadata("design:type", Object)
], EmailAttachment.prototype, "docType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], EmailAttachment.prototype, "zavod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, nullable: false }),
    __metadata("design:type", Object)
], EmailAttachment.prototype, "sklad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'in_process' }),
    __metadata("design:type", Boolean)
], EmailAttachment.prototype, "inProcess", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_inventory' }),
    __metadata("design:type", Boolean)
], EmailAttachment.prototype, "isInventory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => processed_statement_entity_1.ProcessedStatement, (statement) => statement.emailAttachment),
    __metadata("design:type", Array)
], EmailAttachment.prototype, "processedStatements", void 0);
exports.EmailAttachment = EmailAttachment = __decorate([
    (0, typeorm_1.Entity)('email_attachments')
], EmailAttachment);
//# sourceMappingURL=email-attachment.entity.js.map