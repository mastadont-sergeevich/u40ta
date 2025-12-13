import { TelegramUsersService } from './telegram-users.service';
import { TelegramUser } from './entities/telegram-user.entity';
export declare class TelegramUsersController {
    private readonly telegramUsersService;
    private readonly logger;
    constructor(telegramUsersService: TelegramUsersService);
    findAll(): Promise<TelegramUser[]>;
    findById(id: number): Promise<TelegramUser>;
    findByTelegramId(telegramId: number): Promise<TelegramUser>;
    create(userData: Partial<TelegramUser>): Promise<TelegramUser>;
    update(id: number, userData: Partial<TelegramUser>): Promise<TelegramUser>;
    remove(id: number): Promise<void>;
}
