import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MolAccess } from './entities/mol-access.entity';
export declare class UsersService {
    private usersRepository;
    private molAccessRepository;
    private readonly logger;
    constructor(usersRepository: Repository<User>, molAccessRepository: Repository<MolAccess>);
    private generateAbr;
    create(createUserDto: CreateUserDto): Promise<User>;
    findByTelegramUsersId(telegramUsersId: number): Promise<User | null>;
    findById(id: number): Promise<User>;
    findAll(): Promise<User[]>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    findOrCreate(telegramUsersId: number, firstName: string, lastName: string): Promise<User>;
    findByTelegramId(telegramId: number): Promise<User | null>;
    hasAccessToStatements(userId: number): Promise<boolean>;
}
