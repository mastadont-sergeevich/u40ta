import { ConfigService } from '@nestjs/config';
import { EmailAttachmentsService } from './services/email-attachments.service';
import { ImapService } from './services/imap.service';
import { EmailAttachmentResponseDto } from './dto/email-attachment-response.dto';
import { DeleteAttachmentResponseDto } from './dto/delete-attachment-response.dto';
interface RequestWithUser extends Express.Request {
    user?: {
        sub: number;
    };
}
export declare class EmailController {
    private readonly imapService;
    private readonly emailAttachmentsService;
    private readonly configService;
    constructor(imapService: ImapService, emailAttachmentsService: EmailAttachmentsService, configService: ConfigService);
    checkEmailNow(): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllAttachments(request: RequestWithUser): Promise<EmailAttachmentResponseDto[]>;
    deleteAttachment(id: number, request: RequestWithUser): Promise<DeleteAttachmentResponseDto>;
    private toResponseDto;
}
export {};
