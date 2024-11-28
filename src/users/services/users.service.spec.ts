import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUserInterceptor } from '../../interceptors/currentUser.interceptor';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, AuthService, CurrentUserInterceptor],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
