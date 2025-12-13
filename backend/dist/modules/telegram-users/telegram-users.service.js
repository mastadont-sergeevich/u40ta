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
var TelegramUsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const telegram_user_entity_1 = require("./entities/telegram-user.entity");
let TelegramUsersService = TelegramUsersService_1 = class TelegramUsersService {
    usersRepository;
    logger = new common_1.Logger(TelegramUsersService_1.name);
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findByTelegramId(telegramId) {
        this.logger.log(`Поиск пользователя по Telegram ID: ${telegramId}`);
        const user = await this.usersRepository.findOne({
            where: { telegram_id: telegramId }
        });
        if (user) {
            this.logger.log(`Пользователь с Telegram ID ${telegramId} найден`);
        }
        else {
            this.logger.log(`Пользователь с Telegram ID ${telegramId} не найден`);
        }
        return user;
    }
    async create(createUserDto) {
        this.logger.log('Создание нового пользователя Telegram');
        this.logger.debug(`Данные для создания: ${JSON.stringify(createUserDto)}`);
        const user = new telegram_user_entity_1.TelegramUser();
        user.telegram_id = createUserDto.telegram_id;
        user.first_name = createUserDto.first_name;
        user.last_name = createUserDto.last_name || null;
        user.username = createUserDto.username || null;
        const savedUser = await this.usersRepository.save(user);
        this.logger.log(`Пользователь создан с ID: ${savedUser.id}`);
        return savedUser;
    }
    async findAll() {
        this.logger.log('Запрос на получение всех пользователей Telegram');
        const users = await this.usersRepository.find();
        this.logger.log(`Найдено пользователей: ${users.length}`);
        return users;
    }
    async findById(id) {
        this.logger.log(`Поиск пользователя по внутреннему ID: ${id}`);
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            this.logger.warn(`Пользователь с ID ${id} не найден`);
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        this.logger.log(`Пользователь с ID ${id} найден`);
        return user;
    }
    async update(id, updateData) {
        this.logger.log(`Обновление пользователя с ID: ${id}`);
        this.logger.debug(`Данные для обновления: ${JSON.stringify(updateData)}`);
        await this.findById(id);
        await this.usersRepository.update(id, updateData);
        const updatedUser = await this.findById(id);
        this.logger.log(`Пользователь с ID ${id} успешно обновлен`);
        return updatedUser;
    }
    async remove(id) {
        this.logger.log(`Удаление пользователя с ID: ${id}`);
        await this.findById(id);
        await this.usersRepository.delete(id);
        this.logger.log(`Пользователь с ID ${id} успешно удален`);
    }
};
exports.TelegramUsersService = TelegramUsersService;
exports.TelegramUsersService = TelegramUsersService = TelegramUsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(telegram_user_entity_1.TelegramUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TelegramUsersService);
//# sourceMappingURL=telegram-users.service.js.map