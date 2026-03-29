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
    async create(createTelegramUserDto) {
        this.logger.log(`Создание пользователя Telegram: ${createTelegramUserDto.telegram_id}`);
        const user = this.usersRepository.create(createTelegramUserDto);
        const savedUser = await this.usersRepository.save(user);
        this.logger.log(`Пользователь Telegram создан с ID: ${savedUser.id}`);
        return savedUser;
    }
    async findByTelegramId(telegramId) {
        this.logger.log(`Поиск пользователя Telegram по ID: ${telegramId}`);
        const user = await this.usersRepository.findOne({
            where: { telegram_id: telegramId }
        });
        this.logger.log(`Пользователь Telegram ${user ? 'найден' : 'не найден'}`);
        return user;
    }
    async findById(id) {
        this.logger.log(`Поиск пользователя Telegram по внутреннему ID: ${id}`);
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            this.logger.warn(`Пользователь Telegram с ID ${id} не найден`);
            throw new common_1.NotFoundException(`TelegramUser with ID ${id} not found`);
        }
        return user;
    }
    async findAll() {
        this.logger.log('Запрос всех пользователей Telegram');
        return this.usersRepository.find();
    }
    async update(id, updateTelegramUserDto) {
        this.logger.log(`Обновление пользователя Telegram с ID: ${id}`);
        await this.findById(id);
        await this.usersRepository.update(id, updateTelegramUserDto);
        const updatedUser = await this.findById(id);
        this.logger.log(`Пользователь Telegram с ID ${id} обновлен`);
        return updatedUser;
    }
    async remove(id) {
        this.logger.log(`Удаление пользователя Telegram с ID: ${id}`);
        await this.findById(id);
        await this.usersRepository.delete(id);
        this.logger.log(`Пользователь Telegram с ID ${id} удален`);
    }
    async findOrCreate(telegramId, userData) {
        this.logger.log(`Поиск или создание пользователя Telegram: ${telegramId}`);
        let user = await this.findByTelegramId(telegramId);
        if (!user) {
            this.logger.log(`Создание нового пользователя Telegram: ${telegramId}`);
            const createDto = {
                telegram_id: telegramId,
                first_name: userData.first_name,
                last_name: userData.last_name,
                username: userData.username,
            };
            user = await this.create(createDto);
        }
        return user;
    }
};
exports.TelegramUsersService = TelegramUsersService;
exports.TelegramUsersService = TelegramUsersService = TelegramUsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(telegram_user_entity_1.TelegramUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TelegramUsersService);
//# sourceMappingURL=telegram-users.service.js.map