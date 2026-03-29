import { AuthService } from './services/auth.service';
import { TelegramLoginDto } from './dto/telegram-login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    telegramLogin(telegramData: TelegramLoginDto): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
    devLogin({ userId }: {
        userId: number;
    }): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
}
