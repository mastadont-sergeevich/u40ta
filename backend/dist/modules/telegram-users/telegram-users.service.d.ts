import { Repository } from 'typeorm';
import { TelegramUser } from './entities/telegram-user.entity';
import { CreateTelegramUserDto } from './dto/create-telegram-user.dto';
import { UpdateTelegramUserDto } from './dto/update-telegram-user.dto';
export declare class TelegramUsersService {
    private usersRepository;
    private readonly logger;
    constructor(usersRepository: Repository<TelegramUser>);
    create(createTelegramUserDto: CreateTelegramUserDto): Promise<TelegramUser>;
    findByTelegramId(telegramId: number): Promise<TelegramUser | null>;
    findById(id: number): Promise<TelegramUser>;
    findAll(): Promise<TelegramUser[]>;
    update(id: number, updateTelegramUserDto: UpdateTelegramUserDto): Promise<TelegramUser>;
    remove(id: number): Promise<void>;
    findOrCreate(telegramId: number, userData: Partial<CreateTelegramUserDto>): Promise<TelegramUser>;
}
