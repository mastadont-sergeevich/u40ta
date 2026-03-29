import { JwtService } from '@nestjs/jwt';
import { TelegramAuthService } from './telegram-auth.service';
import { UsersService } from '../../users/users.service';
import { TelegramUsersService } from '../../telegram-users/telegram-users.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
export declare class AuthService {
    private telegramAuthService;
    private usersService;
    private telegramUsersService;
    private jwtService;
    private readonly logger;
    constructor(telegramAuthService: TelegramAuthService, usersService: UsersService, telegramUsersService: TelegramUsersService, jwtService: JwtService);
    devLogin(userId: number): Promise<AuthResponseDto>;
    telegramLogin(loginData: any): Promise<AuthResponseDto>;
    private generateJwtToken;
    validateToken(token: string): Promise<any>;
    getCurrentUser(userId: number): Promise<any>;
}
