"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const telegram_users_controller_1 = require("./telegram-users.controller");
describe('TelegramUsersController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [telegram_users_controller_1.TelegramUsersController],
        }).compile();
        controller = module.get(telegram_users_controller_1.TelegramUsersController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=telegram-users.controller.spec.js.map