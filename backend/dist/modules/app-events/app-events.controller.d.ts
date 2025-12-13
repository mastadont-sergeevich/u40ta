import { Observable } from 'rxjs';
import { AppEventsService } from './app-events.service';
export declare class AppEventsController {
    private readonly appEventsService;
    constructor(appEventsService: AppEventsService);
    sse(): Observable<MessageEvent>;
}
