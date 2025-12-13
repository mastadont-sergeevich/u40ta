"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const telegram_users_service_1 = require("./telegram-users.service");
describe('TelegramUsersService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [telegram_users_service_1.TelegramUsersService],
        }).compile();
        service = module.get(telegram_users_service_1.TelegramUsersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=telegram-users.service.spec.js.map