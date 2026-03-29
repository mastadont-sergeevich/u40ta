import { Observable } from 'rxjs';
export declare class AppEventsService {
    private eventSubject;
    notifyStatementLoaded(): void;
    notifyStatementDeleted(attachmentId: number): void;
    notifyStatementActiveChanged(attachmentId: number, zavod: number, sklad: string): void;
    notifyStatementUpdated(attachmentId: number): void;
    notifyAccessChanged(userId: number): void;
    notifyUserDataUpdated(userId: number): void;
    getEventStream(): Observable<{
        message: string;
    }>;
}
