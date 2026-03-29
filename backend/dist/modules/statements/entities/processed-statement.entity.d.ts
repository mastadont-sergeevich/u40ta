import { EmailAttachment } from '../../email/entities/email-attachment.entity';
export declare class ProcessedStatement {
    id: number;
    emailAttachment: EmailAttachment;
    emailAttachmentId: number;
    zavod: number;
    sklad: string;
    doc_type: string;
    inv_number: string;
    party_number: string;
    buh_name: string;
    have_object: boolean;
    is_ignore: boolean;
    is_excess: boolean;
}
