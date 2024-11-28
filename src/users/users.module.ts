import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserMiddleware } from 'src/middleware/current-user.middleware';
import { CurrentUserInterceptor } from '../interceptors/currentUser.interceptor';
import { UsersController } from '../users/controller/users.controller';
import { User } from './entities/users.entity';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, AuthService, CurrentUserInterceptor],
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserMiddleware).forRoutes('*');
    }
}
