import { AuthService } from './services/auth.service';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    telegramLogin(telegramData: any): Promise<{
        status: string;
        access_token: string;
    } | {
        status: string;
        access_token?: undefined;
    }>;
    devLogin({ userId }: {
        userId: number;
    }): Promise<{
        status: string;
        access_token: string;
    }>;
}
