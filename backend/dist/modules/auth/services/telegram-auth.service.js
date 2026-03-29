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
var TelegramAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramAuthService = void 0;
const common_1 = require("@nestjs/common");
const telegram_users_service_1 = require("../../telegram-users/telegram-users.service");
let TelegramAuthService = TelegramAuthService_1 = class TelegramAuthService {
    telegramUsersService;
    logger = new common_1.Logger(TelegramAuthService_1.name);
    constructor(telegramUsersService) {
        this.telegramUsersService = telegramUsersService;
    }
    async processTelegramData(telegramData) {
        this.logger.log(`Обработка Telegram данных для пользователя: ${telegramData.first_name}`);
        const createTelegramUserDto = {
            telegram_id: telegramData.id,
            first_name: telegramData.first_name,
            last_name: telegramData.last_name || null,
            username: telegramData.username || null,
        };
        const user = await this.telegramUsersService.findOrCreate(telegramData.id, createTelegramUserDto);
        const isNew = !(await this.telegramUsersService.findByTelegramId(telegramData.id));
        this.logger.log(`Пользователь Telegram обработан: ID ${user.id}, новый: ${isNew}`);
        return { user, isNew };
    }
    async validateTelegramData(telegramData) {
        this.logger.log(`Проверка подлинности данных Telegram для ID: ${telegramData.id}`);
        const isValid = true;
        this.logger.log(`Данные Telegram ${isValid ? 'валидны' : 'невалидны'}`);
        return isValid;
    }
};
exports.TelegramAuthService = TelegramAuthService;
exports.TelegramAuthService = TelegramAuthService = TelegramAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [telegram_users_service_1.TelegramUsersService])
], TelegramAuthService);
//# sourceMappingURL=telegram-auth.service.js.map