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
const telegram_users_service_1 = require("../../telegram-users/telegram-users.service");
let AuthService = AuthService_1 = class AuthService {
    telegramAuthService;
    usersService;
    telegramUsersService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(telegramAuthService, usersService, telegramUsersService, jwtService) {
        this.telegramAuthService = telegramAuthService;
        this.usersService = usersService;
        this.telegramUsersService = telegramUsersService;
        this.jwtService = jwtService;
    }
    async devLogin(userId) {
        this.logger.log(`Dev-авторизация для пользователя ID: ${userId}`);
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const token = await this.generateJwtToken(user);
        this.logger.log(`Dev-авторизация успешна для пользователя: ${user.firstName}`);
        return { access_token: token };
    }
    async telegramLogin(loginData) {
        this.logger.log(`=== Telegram авторизация START ===`);
        this.logger.log(`Данные от Telegram: ${JSON.stringify({
            id: loginData.id,
            first_name: loginData.first_name,
            last_name: loginData.last_name
        })}`);
        const telegramAuthResult = await this.telegramAuthService.processTelegramData(loginData);
        this.logger.log(`Пользователь Telegram: ID ${telegramAuthResult.user.id}, новый: ${telegramAuthResult.isNew}`);
        const user = await this.usersService.findOrCreate(telegramAuthResult.user.id, loginData.first_name, loginData.last_name || '');
        this.logger.log(`Пользователь системы: ID ${user.id}, abr: ${user.abr}`);
        const token = await this.generateJwtToken(user);
        this.logger.log(`=== Telegram авторизация SUCCESS ===`);
        this.logger.log(`Токен сгенерирован для пользователя: ${user.firstName} ${user.lastName}`);
        return { access_token: token };
    }
    async generateJwtToken(user) {
        this.logger.log(`Генерация JWT токена для пользователя ID: ${user.id}`);
        const payload = {
            sub: user.id,
            abr: user.abr,
            firstName: user.firstName,
            lastName: user.lastName,
            telegramUsersId: user.telegramUsersId,
        };
        this.logger.debug(`Payload JWT: ${JSON.stringify(payload)}`);
        const token = this.jwtService.sign(payload);
        this.logger.log(`JWT токен успешно сгенерирован`);
        return token;
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            this.logger.log(`Токен валиден для пользователя ID: ${payload.sub}`);
            return payload;
        }
        catch (error) {
            this.logger.warn(`Невалидный токен: ${error.message}`);
            return null;
        }
    }
    async getCurrentUser(userId) {
        this.logger.log(`Получение данных текущего пользователя ID: ${userId}`);
        try {
            const user = await this.usersService.findById(userId);
            this.logger.log(`Текущий пользователь: ${user.firstName} ${user.lastName}`);
            return user;
        }
        catch (error) {
            this.logger.error(`Ошибка получения пользователя: ${error.message}`);
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [telegram_auth_service_1.TelegramAuthService,
        users_service_1.UsersService,
        telegram_users_service_1.TelegramUsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map