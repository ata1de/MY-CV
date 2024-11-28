import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { CreateUserDto } from '../dtos/create-user-dto';
import { CurrentUserInterceptor } from './../../interceptors/currentUser.interceptor';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const users = [
            {
                id: 1,
                email: 'teste@email.com',
                password: 'hashed.salt',
                name: 'test',
            },
        ];

        const fakeUsersService = {
            findOne: (email: string) => {
                return Promise.resolve(
                    users.find((user) => user.email === email)
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
                return Promise.resolve(newUser);
            },
            update: () => Promise.resolve({ id: 1, email: 'teste@email.com' }),
            remove: () => Promise.resolve({ id: 1 }),
            findAll: () => Promise.resolve([]),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                CurrentUserInterceptor,
                CreateUserDto,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should be able to create a user with a salted and hashed password', async () => {
        const body = {
            email: 'newuser@email.com',
            password: '123456',
            name: 'New User',
        };

        const { user, message } = await service.signUp(body);

        expect(user.password).not.toEqual('123456');
        const [hashedPassword, salt] = user.password.split('.');

        expect(hashedPassword).toBeDefined();
        expect(salt).toBeDefined();
        expect(message).toEqual('User created successfully');
    });

    it('should be able to throw an error if user signs up with email that is in use', async () => {
        const body = {
            email: 'teste@email.com',
            password: '123456',
            name: 'Existing User',
        };

        await expect(service.signUp(body)).rejects.toThrow(BadRequestException);
        await expect(service.signUp(body)).rejects.toThrow(
            'User already exists'
        );
    });

    it('should fail with invalid email', async () => {
        const dto = new CreateUserDto();
        dto.email = 'invalidemail';
        dto.password = '123456';
        dto.name = 'Invalid Email Test';

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toEqual('email');
    });

    it('should be able to fail if user provide a wrong password in sign in', async () => {
        const body = {
            email: 'teste@email.com',
            password: 'WrongPassword',
        };

        await expect(service.signIn(body)).rejects.toThrow(BadRequestException);
        await expect(service.signIn(body)).rejects.toThrow(
            'Invalid credentials'
        );
    });

    it('should be able to return user if correct password is provided', async () => {
        await service.signUp({
            email: 'mateus@email.com',
            name: 'test',
            password: '123',
        });

        const { user } = await service.signIn({
            email: 'mateus@email.com',
            password: '123',
        });

        await expect(user).toBeDefined();
        await expect(user.email).toEqual('mateus@email.com');
        await expect(user.name).toEqual('test');
    });
});
