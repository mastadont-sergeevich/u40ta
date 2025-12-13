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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const telegram_auth_service_1 = require("./telegram-auth.service");
const users_service_1 = require("../../users/users.service");
let AuthService = AuthService_1 = class AuthService {
    telegramAuthService;
    usersService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(telegramAuthService, usersService, jwtService) {
        this.telegramAuthService = telegramAuthService;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async devLogin(userId) {
        const user = await this.usersService.findById(userId);
        ;
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const token = await this.generateJwtToken(user);
        return {
            status: 'success',
            access_token: token
        };
    }
    async telegramLogin(loginData) {
        this.logger.log(`Начало обработки Telegram логина для пользователя: ${loginData.first_name}`);
        const approvedUser = await this.usersService.findByTelegramId(loginData.id);
        if (approvedUser) {
            this.logger.log(`Пользователь одобрен, начинаем генерацию JWT: ${approvedUser.firstName}`);
            const token = await this.generateJwtToken(approvedUser);
            this.logger.log(`JWT токен успешно сгенерирован для пользователя: ${approvedUser.firstName}`);
            return {
                status: 'success',
                access_token: token
            };
        }
        this.logger.log(`Пользователь не найден в одобренных, проверяем заявки для Telegram ID: ${loginData.id}`);
        const { user: telegramUser, isNew } = await this.telegramAuthService.createOrFind(loginData);
        this.logger.log(`Обработка заявки завершена, пользователь: ${telegramUser.first_name}, новая заявка: ${isNew}`);
        return {
            status: 'pending'
        };
    }
    async generateJwtToken(user) {
        this.logger.log(`Начало генерации JWT токена для пользователя ID: ${user.id}`);
        const payload = {
            sub: user.id,
            role: user.role,
        };
        this.logger.debug(`Сгенерирован payload для JWT: ${JSON.stringify(payload)}`);
        const token = this.jwtService.sign(payload);
        this.logger.log(`JWT токен успешно сгенерирован, длина токена: ${token.length} символов`);
        return token;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [telegram_auth_service_1.TelegramAuthService,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map