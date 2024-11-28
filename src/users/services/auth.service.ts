import {
    BadRequestException,
    Injectable,
    UseInterceptors,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from '../dtos/create-user-dto';
import { User } from '../entities/users.entity';
import { CurrentUser } from './../../decorators/currentUser.decorator';
import { CurrentUserInterceptor } from './../../interceptors/currentUser.interceptor';
import { UsersService } from './users.service';

const scryptAsync = promisify(scrypt);

@UseInterceptors(CurrentUserInterceptor)
@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async signUp({ email, password, name }: CreateUserDto) {
        const existingUser = await this.userService.findOne(email);

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const salt = crypto.randomBytes(8).toString('hex');

        const hash = (await scryptAsync(password, salt, 32)) as Buffer;

        const hashedPassword = `${hash.toString('hex')}.${salt}`;

        const newUser = await this.userService.create({
            email,
            password: hashedPassword,
            name,
        });

        return {
            user: newUser,
            message: 'User created successfully',
        };
    }

    async currentUser(@CurrentUser() user: User) {
        return user;
    }

    async signIn({
        email,
        password,
    }: Pick<CreateUserDto, 'email' | 'password'>) {
        const user = await this.userService.findOne(email);

        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }

        const [hashedPassword, salt] = user.password.split('.');

        const hash = (await scryptAsync(password, salt, 32)) as Buffer;

        if (hashedPassword !== hash.toString('hex')) {
            throw new BadRequestException('Invalid credentials');
        }

        return {
            message: 'User signed in successfully',
            user,
        };
    }
}
