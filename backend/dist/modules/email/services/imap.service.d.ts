import { EmailProcessor } from './email-processor.service';
export declare class ImapService {
    private emailProcessor;
    private imap;
    constructor(emailProcessor: EmailProcessor);
    checkForNewEmails(): Promise<unknown>;
    private processNewEmails;
    private processEmailsSequentially;
    private processEmail;
    private handleParsedEmail;
    private processAttachment;
    private saveFileToDisk;
}
