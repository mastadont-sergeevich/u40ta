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
exports.StatementsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../modules/auth/guards/jwt-auth.guard");
const statement_parser_service_1 = require("./services/statement-parser.service");
let StatementsController = class StatementsController {
    parserService;
    constructor(parserService) {
        this.parserService = parserService;
    }
    async getStatement(attachmentId) {
        try {
            const statements = await this.parserService.parseStatement(attachmentId);
            return {
                success: true,
                attachmentId,
                statements,
                count: statements.length,
                message: `Загружено ${statements.length} строк`
            };
        }
        catch (error) {
            return {
                success: false,
                attachmentId,
                statements: [],
                count: 0,
                error: error.message
            };
        }
    }
};
exports.StatementsController = StatementsController;
__decorate([
    (0, common_1.Get)(':attachmentId'),
    __param(0, (0, common_1.Param)('attachmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatementsController.prototype, "getStatement", null);
exports.StatementsController = StatementsController = __decorate([
    (0, common_1.Controller)('statements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [statement_parser_service_1.StatementParserService])
], StatementsController);
//# sourceMappingURL=statements.controller.js.map