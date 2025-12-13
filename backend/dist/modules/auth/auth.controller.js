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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./services/auth.service");
let AuthController = AuthController_1 = class AuthController {
    authService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService) {
        this.authService = authService;
    }
    async telegramLogin(telegramData) {
        this.logger.log(`Получен запрос на авторизацию через Telegram для пользователя: ${telegramData.first_name}`);
        const result = await this.authService.telegramLogin(telegramData);
        if (result.status === 'success') {
            this.logger.log(`Успешная авторизация пользователя: ${telegramData.first_name}`);
            this.logger.debug(`JWT токен сгенерирован`);
        }
        else {
            this.logger.log(`Пользователь ожидает одобрения: ${telegramData.first_name}`);
        }
        return result;
    }
    async devLogin({ userId }) {
        if (process.env.NODE_ENV === 'production') {
            this.logger.warn('Попытка использования dev-login в продакшене');
            throw new common_1.NotFoundException('Метод не найден');
        }
        this.logger.log(`Получен запрос на dev-авторизацию для пользователя ID: ${userId}`);
        const result = await this.authService.devLogin(userId);
        this.logger.log(`Dev-авторизация завершена для пользователя ID: ${userId}`);
        return result;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('telegram'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "telegramLogin", null);
__decorate([
    (0, common_1.Post)('dev-login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "devLogin", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map