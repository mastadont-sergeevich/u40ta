import type { Request as ExpressRequest } from 'express';
import { ImapService } from './services/imap.service';
import { Repository } from 'typeorm';
import { EmailAttachment } from './entities/email-attachment.entity';
interface RequestWithUser extends ExpressRequest {
    user?: {
        role: string;
        sub: number;
    };
}
export declare class EmailController {
    private readonly imapService;
    private readonly emailAttachmentRepository;
    constructor(imapService: ImapService, emailAttachmentRepository: Repository<EmailAttachment>);
    checkEmailNow(): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllAttachments(request: RequestWithUser): Promise<EmailAttachment[]>;
}
export {};
