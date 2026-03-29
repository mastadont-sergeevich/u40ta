import type { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
interface RequestWithUser extends ExpressRequest {
    user?: {
        sub: number;
    };
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyAbr(request: RequestWithUser): Promise<{
        abr: null;
    } | {
        abr: string;
    }>;
    getMyId(request: RequestWithUser): Promise<{
        userId: number | null;
    }>;
    checkAccessToStatements(request: RequestWithUser): Promise<{
        hasAccessToStatements: boolean;
    }>;
    findById(id: string): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
}
export {};
