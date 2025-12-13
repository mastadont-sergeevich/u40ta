"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImapService = void 0;
const common_1 = require("@nestjs/common");
const imap_1 = __importDefault(require("imap"));
const mailparser_1 = require("mailparser");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const email_processor_service_1 = require("./email-processor.service");
let ImapService = class ImapService {
    emailProcessor;
    imap;
    constructor(emailProcessor) {
        this.emailProcessor = emailProcessor;
    }
    async checkForNewEmails() {
        console.log('🔄 Ручная проверка почты...');
        return new Promise((resolve, reject) => {
            this.imap = new imap_1.default({
                user: 'u40ta@mail.ru',
                password: 'YxTNPTFgz3VG8b1nzxPw',
                host: 'imap.mail.ru',
                port: 993,
                tls: true,
                tlsOptions: { rejectUnauthorized: false }
            });
            this.imap.once('ready', async () => {
                console.log('✅ IMAP подключен к Mail.ru');
                try {
                    await this.processNewEmails();
                    this.imap.end();
                    resolve(null);
                }
                catch (error) {
                    this.imap.end();
                    reject(error);
                }
            });
            this.imap.once('error', (err) => {
                console.error('❌ IMAP ошибка:', err.message);
                reject(new Error(`Ошибка подключения: ${err.message}`));
            });
            console.log('🔄 Подключаемся к IMAP...');
            this.imap.connect();
        });
    }
    async processNewEmails() {
        return new Promise((resolve, reject) => {
            this.imap.openBox('INBOX', false, (err, box) => {
                if (err) {
                    reject(new Error(`Ошибка открытия INBOX: ${err.message}`));
                    return;
                }
                this.imap.search(['UNSEEN'], (err, results) => {
                    if (err) {
                        reject(new Error(`Ошибка поиска писем: ${err.message}`));
                        return;
                    }
                    if (results.length > 0) {
                        console.log(`📨 Найдено новых писем: ${results.length}`);
                        this.processEmailsSequentially(results)
                            .then(resolve)
                            .catch(reject);
                    }
                    else {
                        console.log('📭 Новых писем нет');
                        resolve(null);
                    }
                });
            });
        });
    }
    async processEmailsSequentially(uids) {
        for (const uid of uids) {
            await this.processEmail(uid);
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
                                    console.error('Ошибка пометки письма:', err);
                                }
                                else {
                                    console.log('✅ Письмо помечено как прочитанное');
                                }
                                resolve(parsed);
                            });
                        }
                        catch (error) {
                            console.error('Ошибка парсинга письма:', error);
                            reject(error);
                        }
                    });
                });
            });
            fetch.once('error', (err) => {
                console.error('Ошибка получения письма:', err);
                reject(err);
            });
        });
    }
    async handleParsedEmail(parsedEmail) {
        console.log('📧 Обрабатываем письмо от:', parsedEmail.from?.value?.[0]?.address);
        if (!parsedEmail.attachments || parsedEmail.attachments.length === 0) {
            console.log('📭 Вложений нет, пропускаем');
            return;
        }
        console.log(`📎 Найдено вложений: ${parsedEmail.attachments.length}`);
        for (const attachment of parsedEmail.attachments) {
            await this.processAttachment(attachment, parsedEmail);
        }
    }
    async processAttachment(attachment, email) {
        try {
            const filePath = await this.saveFileToDisk(attachment);
            await this.emailProcessor.analyzeAndSaveAttachment(filePath, attachment.filename, email.from?.value?.[0]?.address, email.subject);
        }
        catch (error) {
            console.error('❌ Ошибка обработки вложения:', error);
        }
    }
    async saveFileToDisk(attachment) {
        const attachmentsDir = path.join(process.cwd(), '..', 'email-attachments');
        const filename = attachment.filename;
        const filePath = path.join(attachmentsDir, filename);
        await fs.promises.writeFile(filePath, attachment.content);
        console.log('💾 Сохранен файл:', filename);
        return filePath;
    }
};
exports.ImapService = ImapService;
exports.ImapService = ImapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_processor_service_1.EmailProcessor])
], ImapService);
//# sourceMappingURL=imap.service.js.map