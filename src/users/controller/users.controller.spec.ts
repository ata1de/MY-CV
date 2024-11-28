import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUserInterceptor } from '../../interceptors/currentUser.interceptor';
import { User } from '../entities/users.entity';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
    let controller: UsersController;
    let fakeAuthService: Partial<AuthService>;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users = [
            {
                id: 1,
                email: 'teste@email.com',
                password: 'hashed.salt',
                name: 'test',
            },
        ];

        fakeAuthService = {
            signUp: () =>
                Promise.resolve({
                    user: {
                        id: 1,
                        email: 'test',
                        password: 'test',
                        name: 'test',
                    } as User,
                    message: 'User signed up successfully',
                }),
            signIn: () =>
                Promise.resolve({
                    user: {
                        id: 1,
                        email: 'test',
                        password: 'test',
                        name: 'test',
                    } as User,
                    message: 'User signed in successfully',
                }),
            currentUser: () =>
                Promise.resolve({
                    id: 1,
                    email: 'test',
                    password: 'test',
                    name: 'test',
                } as User),
        };

        fakeUsersService = {
            findOne: (email: string) => {
                return Promise.resolve(
                    users.find((user) => user.email === email) as User
                );
            },
            create: ({ email, password, name }) => {
                const newUser = {
                    id: Math.floor(Math.random() * 99999),
                    email,
                    password,
                    name,
                };
                users.push(newUser);
                return Promise.resolve(newUser) as Promise<User>;
            },
            // update: () => Promise.resolve({ id: 1, email: 'teste@email.com' }),
            // remove: () => Promise.resolve({ id: 1 }),
            // findAll: () => Promise.resolve([]),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                CurrentUserInterceptor,
                {
                    provide: AuthService,
                    useValue: fakeAuthService,
                },
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
