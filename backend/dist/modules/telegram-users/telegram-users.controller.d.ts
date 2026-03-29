import { CreateTelegramUserDto } from './dto/create-telegram-user.dto';
import { UpdateTelegramUserDto } from './dto/update-telegram-user.dto';
import { TelegramUsersService } from './telegram-users.service';
import { TelegramUser } from './entities/telegram-user.entity';
export declare class TelegramUsersController {
    private readonly telegramUsersService;
    private readonly logger;
    constructor(telegramUsersService: TelegramUsersService);
    findAll(): Promise<TelegramUser[]>;
    findById(id: number): Promise<TelegramUser>;
    findByTelegramId(telegramId: number): Promise<TelegramUser>;
    create(userData: CreateTelegramUserDto): Promise<TelegramUser>;
    update(id: number, userData: UpdateTelegramUserDto): Promise<TelegramUser>;
    remove(id: number): Promise<void>;
}
