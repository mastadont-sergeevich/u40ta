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
const statement_service_1 = require("./services/statement.service");
const statement_objects_service_1 = require("./services/statement-objects.service");
const statement_response_dto_1 = require("./dto/statement-response.dto");
const update_ignore_dto_1 = require("./dto/update-ignore.dto");
const update_have_object_dto_1 = require("./dto/update-have-object.dto");
const statement_response_dto_2 = require("./dto/statement-response.dto");
let StatementsController = class StatementsController {
    statementService;
    statementObjectsService;
    constructor(statementService, statementObjectsService) {
        this.statementService = statementService;
        this.statementObjectsService = statementObjectsService;
    }
    async findByInv(inv, zavod, sklad) {
        try {
            console.log(`[StatementsController] Поиск записей ведомости по inv=${inv}, zavod=${zavod}, sklad=${sklad}`);
            if (!inv || inv.trim() === '') {
                return {
                    success: false,
                    error: 'Инвентарный номер обязателен',
                    statements: []
                };
            }
            const zavodValue = zavod ? parseInt(zavod, 10) : undefined;
            const skladValue = sklad || undefined;
            const statements = await this.statementService.findByInv(inv.trim(), zavodValue, skladValue);
            const statementDtos = statement_response_dto_2.ProcessedStatementDto.fromEntities(statements);
            return {
                success: true,
                statements: statementDtos,
                count: statementDtos.length
            };
        }
        catch (error) {
            console.error('[StatementsController] Ошибка поиска записей ведомости:', error);
            return {
                success: false,
                error: error.message,
                statements: []
            };
        }
    }
    async getStatement(attachmentId) {
        try {
            const statements = await this.statementService.parseStatement(attachmentId);
            const response = new statement_response_dto_1.StatementResponseDto();
            response.success = true;
            response.attachmentId = attachmentId;
            response.statements = statements;
            response.count = statements.length;
            response.message = `Загружено ${statements.length} строк`;
            return response;
        }
        catch (error) {
            const response = new statement_response_dto_1.StatementResponseDto();
            response.success = false;
            response.attachmentId = attachmentId;
            response.statements = [];
            response.count = 0;
            response.error = error.message;
            return response;
        }
    }
    async updateIgnoreStatus(dto) {
        try {
            const updated = await this.statementService.updateIgnoreStatus(dto);
            const response = new statement_response_dto_1.StatementResponseDto();
            response.success = true;
            response.attachmentId = dto.attachmentId;
            response.statements = updated;
            response.count = updated.length;
            response.message = `Обновлено ${updated.length} записей`;
            return response;
        }
        catch (error) {
            const response = new statement_response_dto_1.StatementResponseDto();
            response.success = false;
            response.attachmentId = dto.attachmentId;
            response.statements = [];
            response.count = 0;
            response.error = error.message;
            return response;
        }
    }
    async updateHaveObject(dto) {
        await this.statementObjectsService.updateSingleHaveObject(dto.statementId);
    }
};
exports.StatementsController = StatementsController;
__decorate([
    (0, common_1.Get)('by-inv'),
    __param(0, (0, common_1.Query)('inv')),
    __param(1, (0, common_1.Query)('zavod')),
    __param(2, (0, common_1.Query)('sklad')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StatementsController.prototype, "findByInv", null);
__decorate([
    (0, common_1.Get)(':attachmentId'),
    __param(0, (0, common_1.Param)('attachmentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatementsController.prototype, "getStatement", null);
__decorate([
    (0, common_1.Post)('ignore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_ignore_dto_1.UpdateIgnoreDto]),
    __metadata("design:returntype", Promise)
], StatementsController.prototype, "updateIgnoreStatus", null);
__decorate([
    (0, common_1.Post)('update-have-object'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_have_object_dto_1.UpdateHaveObjectDto]),
    __metadata("design:returntype", Promise)
], StatementsController.prototype, "updateHaveObject", null);
exports.StatementsController = StatementsController = __decorate([
    (0, common_1.Controller)('statements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [statement_service_1.StatementService,
        statement_objects_service_1.StatementObjectsService])
], StatementsController);
//# sourceMappingURL=statements.controller.js.map