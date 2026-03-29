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
var TelegramUsersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramUsersController = void 0;
const common_1 = require("@nestjs/common");
const create_telegram_user_dto_1 = require("./dto/create-telegram-user.dto");
const update_telegram_user_dto_1 = require("./dto/update-telegram-user.dto");
const telegram_users_service_1 = require("./telegram-users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TelegramUsersController = TelegramUsersController_1 = class TelegramUsersController {
    telegramUsersService;
    logger = new common_1.Logger(TelegramUsersController_1.name);
    constructor(telegramUsersService) {
        this.telegramUsersService = telegramUsersService;
        this.logger.log('TelegramUsersController инициализирован');
    }
    findAll() {
        this.logger.log('Выполняется запрос на получение всех заявок пользователей Telegram');
        return this.telegramUsersService.findAll();
    }
    async findById(id) {
        this.logger.log(`Выполняется запрос на получение заявки с ID: ${id}`);
        const user = await this.telegramUsersService.findById(id);
        if (!user) {
            this.logger.warn(`Заявка с ID ${id} не найдена`);
            throw new common_1.NotFoundException(`TelegramUser with ID ${id} not found`);
        }
        this.logger.log(`Заявка с ID ${id} успешно найдена`);
        return user;
    }
    async findByTelegramId(telegramId) {
        this.logger.log(`Выполняется запрос на получение заявки с Telegram ID: ${telegramId}`);
        const user = await this.telegramUsersService.findByTelegramId(telegramId);
        if (!user) {
            this.logger.warn(`Заявка с Telegram ID ${telegramId} не найдена`);
            throw new common_1.NotFoundException(`TelegramUser with Telegram ID ${telegramId} not found`);
        }
        this.logger.log(`Заявка с Telegram ID ${telegramId} успешно найдена`);
        return user;
    }
    async create(userData) {
        this.logger.log('Создание новой заявки пользователя Telegram');
        const createdUser = await this.telegramUsersService.create(userData);
        this.logger.log(`Новая заявка создана с ID: ${createdUser.id}`);
        return createdUser;
    }
    async update(id, userData) {
        this.logger.log(`Выполняется запрос на обновление заявки с ID: ${id}`);
        const updatedUser = await this.telegramUsersService.update(id, userData);
        this.logger.log(`Заявка с ID ${id} успешно обновлена`);
        return updatedUser;
    }
    async remove(id) {
        this.logger.log(`Выполняется запрос на удаление заявки с ID: ${id}`);
        await this.telegramUsersService.remove(id);
        this.logger.log(`Заявка с ID ${id} успешно удалена`);
    }
};
exports.TelegramUsersController = TelegramUsersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelegramUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TelegramUsersController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('telegram/:telegramId'),
    __param(0, (0, common_1.Param)('telegramId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TelegramUsersController.prototype, "findByTelegramId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_telegram_user_dto_1.CreateTelegramUserDto]),
    __metadata("design:returntype", Promise)
], TelegramUsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_telegram_user_dto_1.UpdateTelegramUserDto]),
    __metadata("design:returntype", Promise)
], TelegramUsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TelegramUsersController.prototype, "remove", null);
exports.TelegramUsersController = TelegramUsersController = TelegramUsersController_1 = __decorate([
    (0, common_1.Controller)('telegram-users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [telegram_users_service_1.TelegramUsersService])
], TelegramUsersController);
//# sourceMappingURL=telegram-users.controller.js.map