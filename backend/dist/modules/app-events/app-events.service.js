"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEventsService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let AppEventsService = class AppEventsService {
    eventSubject = new rxjs_1.Subject();
    notifyStatementLoaded() {
        this.eventSubject.next({
            type: 'statement-loaded',
            message: 'Новая ведомость загружена'
        });
    }
    notifyStatementDeleted(attachmentId) {
        this.eventSubject.next({
            type: 'statement-deleted',
            message: 'Ведомость удалена',
            data: { attachmentId }
        });
    }
    notifyStatementActiveChanged(attachmentId, zavod, sklad) {
        this.eventSubject.next({
            type: 'statement-active-changed',
            message: `Ведомость ${attachmentId} стала активной у другого пользователя`,
            data: {
                attachmentId,
                zavod,
                sklad
            }
        });
    }
    notifyStatementUpdated(attachmentId) {
        this.eventSubject.next({
            type: 'statement-updated',
            message: `Ведомость ${attachmentId} обновлена`,
            data: { attachmentId }
        });
    }
    notifyAccessChanged(userId) {
        this.eventSubject.next({
            type: 'access-changed',
            message: 'Права доступа изменены',
            data: { userId }
        });
    }
    notifyUserDataUpdated(userId) {
        this.eventSubject.next({
            type: 'user-data-updated',
            message: 'Данные пользователя обновлены',
            data: { userId }
        });
    }
    getEventStream() {
        return this.eventSubject.asObservable();
    }
};
exports.AppEventsService = AppEventsService;
exports.AppEventsService = AppEventsService = __decorate([
    (0, common_1.Injectable)()
], AppEventsService);
//# sourceMappingURL=app-events.service.js.map