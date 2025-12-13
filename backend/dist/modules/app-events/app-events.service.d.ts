import { Observable } from 'rxjs';
export declare class AppEventsService {
    private eventSubject;
    notifyAll(): void;
    getEventStream(): Observable<{
        message: string;
    }>;
}
