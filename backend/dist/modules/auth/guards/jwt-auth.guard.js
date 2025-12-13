"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard {
    jwtService;
    configService;
    logger = new common_1.Logger(JwtAuthGuard_1.name);
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async canActivate(context) {
        this.logger.debug('Активация JwtAuthGuard для проверки доступа');
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (this.configService.get('NODE_ENV') === 'development') {
            this.logger.debug('Режим разработки - JWT проверка отключена');
            const token = this.extractTokenFromHeader(request);
            if (token) {
                try {
                    const payload = this.jwtService.decode(token);
                    if (payload) {
                        request.user = payload;
                        this.logger.debug(`Dev режим: пользователь ID ${payload.sub}, роль ${payload.role}`);
                    }
                }
                catch (error) {
                    this.logger.debug(`Dev режим: ошибка декодирования токена: ${error.message}`);
                }
            }
            return true;
        }
        if (!token) {
            this.logger.warn('Попытка доступа без JWT токена');
            throw new common_1.UnauthorizedException('Требуется авторизация');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            request.user = payload;
            this.logger.debug(`Успешная проверка JWT для пользователя ID: ${payload.sub}, роль: ${payload.role}`);
            return true;
        }
        catch (error) {
            this.logger.warn(`Невалидный JWT токен: ${error.message}`);
            throw new common_1.UnauthorizedException('Невалидный токен авторизации');
        }
    }
    extractTokenFromHeader(request) {
        this.logger.debug('Извлечение JWT токена из заголовков запроса');
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            this.logger.debug('Заголовок Authorization отсутствует');
            return undefined;
        }
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            this.logger.debug(`Неверный формат заголовка Authorization: ${authHeader}`);
            return undefined;
        }
        this.logger.debug('JWT токен успешно извлечен из заголовка');
        return token;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map