import { Injectable } from '@nestjs/common';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import * as fs from 'fs';
import * as path from 'path';
import { EmailProcessor } from './email-processor.service';

@Injectable()
export class ImapService {
  private imap: Imap;

  constructor(private emailProcessor: EmailProcessor) {}

  public async checkForNewEmails() {
    console.log('Ручная проверка почты...');
    
    return new Promise((resolve, reject) => {
      this.imap = new Imap({
        user: 'u40ta@mail.ru',
        password: 'YxTNPTFgz3VG8b1nzxPw',
        host: 'imap.mail.ru',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
      });

      this.imap.once('ready', async () => {
        console.log('IMAP подключен к Mail.ru');
        try {
          await this.processNewEmails();
          this.imap.end();
          resolve(null);
        } catch (error) {
          this.imap.end();
          reject(error);
        }
      });

      this.imap.once('error', (err) => {
        console.error('IMAP ошибка:', err.message);
        reject(new Error(`Ошибка подключения: ${err.message}`));
      });

      console.log('Подключаемся к IMAP...');
      this.imap.connect();
    });
  }

  private async processNewEmails() {
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
            console.log(`Найдено новых писем: ${results.length}`);
            this.processEmailsSequentially(results)
              .then(resolve)
              .catch(reject);
          } else {
            console.log('Новых писем нет');
            resolve(null);
          }
        });
      });
    });
  }

  private async processEmailsSequentially(uids: number[]) {
    for (const uid of uids) {
      await this.processEmail(uid);
    }
  }

  private async processEmail(uid: number) {
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
              const parsed = await simpleParser(buffer);
              await this.handleParsedEmail(parsed);
              
              // Помечаем письмо как прочитанное
              this.imap.addFlags(uid, ['\\Seen'], (err) => {
                if (err) {
                  console.error('Ошибка пометки письма:', err);
                } else {
                  console.log('Письмо помечено как прочитанное');
                }
                resolve(parsed);
              });
            } catch (error) {
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

  private async handleParsedEmail(parsedEmail: any) {
    console.log('Обрабатываем письмо от:', parsedEmail.from?.value?.[0]?.address);
    
    if (!parsedEmail.attachments || parsedEmail.attachments.length === 0) {
      console.log('Вложений нет, пропускаем');
      return;
    }

    console.log(`Найдено вложений: ${parsedEmail.attachments.length}`);
    
    // Обрабатываем каждое вложение
    for (const attachment of parsedEmail.attachments) {
      await this.processAttachment(attachment, parsedEmail);
    }
  }

  /**
   * Обрабатывает отдельное вложение: сохраняет файл и запускает анализ
   */
  private async processAttachment(attachment: any, email: any) {
    try {
      // 1. Сохраняем файл на диск
      const filePath = await this.saveFileToDisk(attachment);
      
      // 2. Вызываем сервис анализа для создания записи в БД
      await this.emailProcessor.analyzeAndSaveAttachment(
        filePath,
        attachment.filename,
        email.from?.value?.[0]?.address,
        email.subject // передаем тему письма для определения ключевого слова "Инвентаризация"
      );
      
    } catch (error) {
      console.error('Ошибка обработки вложения:', error);
    }
  }

  /**
   * Сохраняет файл вложения на диск
   */
  private async saveFileToDisk(attachment: any): Promise<string> {
    //const attachmentsDir = '/email-attachments';
    //const attachmentsDir = path.join(process.cwd(), 'email-attachments');
    const attachmentsDir = path.join(process.cwd(), '..', 'email-attachments');
    const filename = attachment.filename;
    const filePath = path.join(attachmentsDir, filename);

    //await fs.promises.mkdir(attachmentsDir, { recursive: true });
    await fs.promises.writeFile(filePath, attachment.content);
    console.log('Сохранен файл:', filename);

    return filePath;
  }
}