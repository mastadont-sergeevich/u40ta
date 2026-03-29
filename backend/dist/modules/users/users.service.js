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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const mol_access_entity_1 = require("./entities/mol-access.entity");
let UsersService = UsersService_1 = class UsersService {
    usersRepository;
    molAccessRepository;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(usersRepository, molAccessRepository) {
        this.usersRepository = usersRepository;
        this.molAccessRepository = molAccessRepository;
    }
    generateAbr(firstName, lastName) {
        const firstChar = firstName?.charAt(0)?.toUpperCase() || '';
        const lastChar = lastName?.charAt(0)?.toUpperCase() || '';
        return firstChar + lastChar;
    }
    async create(createUserDto) {
        this.logger.log(`Создание пользователя системы для TelegramUsersId: ${createUserDto.telegramUsersId}`);
        if (!createUserDto.abr) {
            createUserDto.abr = this.generateAbr(createUserDto.firstName, createUserDto.lastName);
        }
        const user = this.usersRepository.create(createUserDto);
        const savedUser = await this.usersRepository.save(user);
        this.logger.log(`Пользователь системы создан с ID: ${savedUser.id}, abr: ${savedUser.abr}`);
        return savedUser;
    }
    async findByTelegramUsersId(telegramUsersId) {
        this.logger.log(`Поиск пользователя системы по TelegramUsersId: ${telegramUsersId}`);
        const user = await this.usersRepository.findOne({
            where: { telegramUsersId },
        });
        this.logger.log(`Пользователь системы ${user ? 'найден' : 'не найден'}`);
        return user;
    }
    async findById(id) {
        this.logger.log(`Поиск пользователя системы по ID: ${id}`);
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            this.logger.warn(`Пользователь системы с ID ${id} не найден`);
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findAll() {
        this.logger.log('Запрос всех пользователей системы');
        return this.usersRepository.find();
    }
    async update(id, updateUserDto) {
        this.logger.log(`Обновление пользователя системы с ID: ${id}`);
        const user = await this.findById(id);
        if ((updateUserDto.firstName && updateUserDto.firstName !== user.firstName) ||
            (updateUserDto.lastName && updateUserDto.lastName !== user.lastName)) {
            const newFirstName = updateUserDto.firstName || user.firstName;
            const newLastName = updateUserDto.lastName || user.lastName;
            updateUserDto.abr = this.generateAbr(newFirstName, newLastName);
            this.logger.log(`Пересчет abr для пользователя ${id}: ${updateUserDto.abr}`);
        }
        await this.usersRepository.update(id, updateUserDto);
        const updatedUser = await this.findById(id);
        this.logger.log(`Пользователь системы с ID ${id} обновлен`);
        return updatedUser;
    }
    async remove(id) {
        this.logger.log(`Удаление пользователя системы с ID: ${id}`);
        await this.findById(id);
        await this.usersRepository.delete(id);
        this.logger.log(`Пользователь системы с ID ${id} удален`);
    }
    async findOrCreate(telegramUsersId, firstName, lastName) {
        this.logger.log(`Поиск или создание пользователя системы для TelegramUsersId: ${telegramUsersId}`);
        let user = await this.findByTelegramUsersId(telegramUsersId);
        if (!user) {
            this.logger.log(`Создание нового пользователя системы: ${firstName} ${lastName}`);
            const createDto = {
                telegramUsersId,
                firstName,
                lastName,
                abr: this.generateAbr(firstName, lastName),
            };
            user = await this.create(createDto);
        }
        return user;
    }
    async findByTelegramId(telegramId) {
        this.logger.log(`Поиск пользователя системы по Telegram ID: ${telegramId}`);
        return null;
    }
    async hasAccessToStatements(userId) {
        const count = await this.molAccessRepository.count({ where: { userId } });
        return count > 0;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(mol_access_entity_1.MolAccess)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map