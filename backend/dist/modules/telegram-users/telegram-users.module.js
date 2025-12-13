"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramUsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const telegram_users_service_1 = require("./telegram-users.service");
const telegram_users_controller_1 = require("./telegram-users.controller");
const telegram_user_entity_1 = require("./entities/telegram-user.entity");
const jwt_auth_module_1 = require("../auth/jwt-auth.module");
let TelegramUsersModule = class TelegramUsersModule {
};
exports.TelegramUsersModule = TelegramUsersModule;
exports.TelegramUsersModule = TelegramUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([telegram_user_entity_1.TelegramUser]),
            jwt_auth_module_1.JwtAuthModule,
        ],
        controllers: [telegram_users_controller_1.TelegramUsersController],
        providers: [telegram_users_service_1.TelegramUsersService],
        exports: [telegram_users_service_1.TelegramUsersService],
    })
], TelegramUsersModule);
//# sourceMappingURL=telegram-users.module.js.map