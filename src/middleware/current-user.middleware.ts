import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '@users/services/users.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private userService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {};

        if (userId) {
            const user = await this.userService.findOne(userId);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            req.currentUser = user;
        }

        next();
    }
}
