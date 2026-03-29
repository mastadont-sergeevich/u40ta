import { TelegramUsersService } from '../../telegram-users/telegram-users.service';
import { TelegramUser } from '../../telegram-users/entities/telegram-user.entity';
export declare class TelegramAuthService {
    private telegramUsersService;
    private readonly logger;
    constructor(telegramUsersService: TelegramUsersService);
    processTelegramData(telegramData: any): Promise<{
        user: TelegramUser;
        isNew: boolean;
    }>;
    validateTelegramData(telegramData: any): Promise<boolean>;
}
