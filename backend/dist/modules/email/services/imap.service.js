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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ImapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImapService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const imap_1 = __importDefault(require("imap"));
const mailparser_1 = require("mailparser");
const email_processor_service_1 = require("./email-processor.service");
const logs_service_1 = require("../../logs/logs.service");
let ImapService = ImapService_1 = class ImapService {
    emailProcessor;
    configService;
    logsService;
    imap;
    logger = new common_1.Logger(ImapService_1.name);
    constructor(emailProcessor, configService, logsService) {
        this.emailProcessor = emailProcessor;
        this.configService = configService;
        this.logsService = logsService;
    }
    async checkForNewEmails() {
        this.logger.log('Проверка почты...');
        const user = this.configService.get('email.imap.user');
        const password = this.configService.get('email.imap.password');
        const host = this.configService.get('email.imap.host');
        const port = this.configService.get('email.imap.port');
        if (!user || !password) {
            const errorMsg = 'Отсутствуют учетные данные для IMAP. Проверьте переменные окружения EMAIL_IMAP_USER и EMAIL_IMAP_PASSWORD';
            this.logger.error(errorMsg);
            throw new Error(errorMsg);
        }
        if (!host) {
            const errorMsg = 'Отсутствует хост IMAP. Проверьте переменную EMAIL_IMAP_HOST';
            this.logger.error(errorMsg);
            throw new Error(errorMsg);
        }
        return new Promise((resolve, reject) => {
            const imapConfig = {
                user: user,
                password: password,
                host: host,
                port: port,
                tls: this.configService.get('email.imap.tls') ?? true,
                tlsOptions: { rejectUnauthorized: false }
            };
            this.imap = new imap_1.default(imapConfig);
            this.imap.once('ready', async () => {
                this.logger.log('IMAP подключен');
                try {
                    await this.processNewEmails();
                    this.imap.end();
                    resolve();
                }
                catch (error) {
                    this.logger.error('Ошибка при обработке писем:', error);
                    this.imap.end();
                    reject(error);
                }
            });
            this.imap.once('error', (err) => {
                this.logger.error('IMAP ошибка:', err);
                this.logger.error('Тип ошибки:', err.name);
                this.logger.error('Сообщение ошибки:', err.message);
                this.logger.error('Полный стек:', err.stack);
                let errorMessage = err.message;
                if (err.message && err.message.toLowerCase().includes('authentication')) {
                    errorMessage = 'Ошибка аутентификации. Проверьте логин и пароль.';
                }
                else if (err.message && err.message.toLowerCase().includes('connect')) {
                    errorMessage = 'Не удалось подключиться к серверу. Проверьте хост и порт.';
                }
                else if (err.message && err.message.toLowerCase().includes('timeout')) {
                    errorMessage = 'Таймаут подключения. Проверьте сетевое соединение.';
                }
                else if (!err.message || err.message === '') {
                    errorMessage = 'Неизвестная ошибка подключения. Проверьте настройки IMAP.';
                }
                this.logsService.log('backend', null, {
                    action: 'imap_error',
                    error: errorMessage,
                    originalError: err.message
                });
                reject(new Error(`Ошибка подключения: ${errorMessage}`));
            });
            this.logger.log('Подключаемся к IMAP...');
            this.imap.connect();
        });
    }
    async processNewEmails() {
        return new Promise((resolve, reject) => {
            this.imap.openBox('INBOX', false, (err, box) => {
                if (err) {
                    this.logger.error('Ошибка открытия INBOX:', err);
                    reject(new Error(`Ошибка открытия INBOX: ${err.message}`));
                    return;
                }
                this.imap.search(['UNSEEN'], (err, results) => {
                    if (err) {
                        this.logger.error('Ошибка поиска писем:', err);
                        reject(new Error(`Ошибка поиска писем: ${err.message}`));
                        return;
                    }
                    if (results && results.length > 0) {
                        this.logger.log(`Найдено новых писем: ${results.length}`);
                        this.processEmailsSequentially(results)
                            .then(resolve)
                            .catch(reject);
                    }
                    else {
                        this.logger.log('Новых писем нет');
                        resolve();
                    }
                });
            });
        });
    }
    async processEmailsSequentially(uids) {
        for (const uid of uids) {
            try {
                this.logger.log(`Обработка письма UID: ${uid}`);
                await this.processEmail(uid);
            }
            catch (error) {
                this.logger.error(`Ошибка обработки письма ${uid}:`, error);
            }
        }
    }
    async processEmail(uid) {
        return new Promise((resolve, reject) => {
            const fetch = this.imap.fetch(uid, {
                bodies: '',
                struct: true
            });
            fetch.on('message', (msg) => {
                let buffer = '';
                msg.on('body', (stream) => {
                    stream.on('data', (chunk) => {
                        buffer += chunk.toString('utf8');
                    });
                    stream.once('end', async () => {
                        try {
                            const parsed = await (0, mailparser_1.simpleParser)(buffer);
                            await this.handleParsedEmail(parsed);
                            this.imap.addFlags(uid, ['\\Seen'], (err) => {
                                if (err) {
                                    this.logger.error('Ошибка пометки письма:', err);
                                }
                                else {
                                    this.logger.log(`Письмо ${uid} помечено как прочитанное`);
                                }
                                resolve();
                            });
                        }
                        catch (error) {
                            this.logger.error('Ошибка парсинга письма:', error);
                            reject(error);
                        }
                    });
                });
            });
            fetch.once('error', (err) => {
                this.logger.error('Ошибка получения письма:', err);
                reject(err);
            });
        });
    }
    async handleParsedEmail(parsedEmail) {
        const fromAddress = parsedEmail.from?.value?.[0]?.address;
        this.logger.log('Обрабатываем письмо от:', fromAddress);
        if (!parsedEmail.attachments || parsedEmail.attachments.length === 0) {
            this.logger.log('Вложений нет, пропускаем');
            return;
        }
        this.logger.log(`Найдено вложений: ${parsedEmail.attachments.length}`);
        for (const attachment of parsedEmail.attachments) {
            try {
                this.logger.log(`Обработка вложения: ${attachment.filename}, размер: ${attachment.size} байт`);
                await this.processAttachment(attachment, parsedEmail);
            }
            catch (error) {
                this.logger.error(`Ошибка обработки вложения ${attachment.filename}:`, error);
            }
        }
    }
    async processAttachment(attachment, email) {
        await this.emailProcessor.analyzeAndSaveAttachment(attachment.content, attachment.filename, email.from?.value?.[0]?.address, email.subject);
    }
};
exports.ImapService = ImapService;
exports.ImapService = ImapService = ImapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_processor_service_1.EmailProcessor,
        config_1.ConfigService,
        logs_service_1.LogsService])
], ImapService);
//# sourceMappingURL=imap.service.js.map