import { JwtService } from '@nestjs/jwt';
import { TelegramAuthService } from './telegram-auth.service';
import { UsersService } from '../../users/users.service';
export declare class AuthService {
    private telegramAuthService;
    private usersService;
    private jwtService;
    private readonly logger;
    constructor(telegramAuthService: TelegramAuthService, usersService: UsersService, jwtService: JwtService);
    devLogin(userId: number): Promise<{
        status: string;
        access_token: string;
    }>;
    telegramLogin(loginData: any): Promise<{
        status: string;
        access_token: string;
    } | {
        status: string;
        access_token?: undefined;
    }>;
    private generateJwtToken;
}
