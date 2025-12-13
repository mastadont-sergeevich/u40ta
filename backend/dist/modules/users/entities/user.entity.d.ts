import { TelegramUser } from '../../telegram-users/entities/telegram-user.entity';
export declare class User {
    id: number;
    telegramUserId: number;
    lastName: string;
    firstName: string;
    abr: string;
    role: string;
    telegramUser: TelegramUser;
}
