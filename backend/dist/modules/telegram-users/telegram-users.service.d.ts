import { Repository } from 'typeorm';
import { TelegramUser } from './entities/telegram-user.entity';
export declare class TelegramUsersService {
    private usersRepository;
    private readonly logger;
    constructor(usersRepository: Repository<TelegramUser>);
    findByTelegramId(telegramId: number): Promise<TelegramUser | null>;
    create(createUserDto: any): Promise<TelegramUser>;
    findAll(): Promise<TelegramUser[]>;
    findById(id: number): Promise<TelegramUser>;
    update(id: number, updateData: any): Promise<TelegramUser>;
    remove(id: number): Promise<void>;
}
