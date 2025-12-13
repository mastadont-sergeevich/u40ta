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
exports.ProcessedStatement = void 0;
const typeorm_1 = require("typeorm");
const email_attachment_entity_1 = require("./email-attachment.entity");
let ProcessedStatement = class ProcessedStatement {
    id;
    emailAttachment;
    emailAttachmentId;
    zavod;
    inv_number;
    party_number;
    buh_name;
    have_object;
    is_ignore;
};
exports.ProcessedStatement = ProcessedStatement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProcessedStatement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => email_attachment_entity_1.EmailAttachment),
    (0, typeorm_1.JoinColumn)({ name: 'email_attachment_id' }),
    __metadata("design:type", email_attachment_entity_1.EmailAttachment)
], ProcessedStatement.prototype, "emailAttachment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_attachment_id' }),
    __metadata("design:type", Number)
], ProcessedStatement.prototype, "emailAttachmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], ProcessedStatement.prototype, "zavod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ProcessedStatement.prototype, "inv_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ProcessedStatement.prototype, "party_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProcessedStatement.prototype, "buh_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ProcessedStatement.prototype, "have_object", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ProcessedStatement.prototype, "is_ignore", void 0);
exports.ProcessedStatement = ProcessedStatement = __decorate([
    (0, typeorm_1.Entity)('processed_statements')
], ProcessedStatement);
//# sourceMappingURL=processed-statement.entity.js.map