"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEventsController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const app_events_service_1 = require("./app-events.service");
let AppEventsController = class AppEventsController {
    appEventsService;
    constructor(appEventsService) {
        this.appEventsService = appEventsService;
    }
    sse() {
        return this.appEventsService.getEventStream().pipe((0, operators_1.map)(data => {
            return new MessageEvent('message', {
                data: JSON.stringify(data)
            });
        }));
    }
};
exports.AppEventsController = AppEventsController;
__decorate([
    (0, common_1.Sse)('sse'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], AppEventsController.prototype, "sse", null);
exports.AppEventsController = AppEventsController = __decorate([
    (0, common_1.Controller)('app-events'),
    __metadata("design:paramtypes", [app_events_service_1.AppEventsService])
], AppEventsController);
//# sourceMappingURL=app-events.controller.js.map