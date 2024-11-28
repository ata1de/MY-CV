import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor {
    new (...args: any[]): object;
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) {
        this.dto = dto;
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                return this.serialize(data);
            })
        );
    }

    serialize(data: ClassConstructor) {
        return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
        });
    }
}
