import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/currentUser.decorator';
import { SerializeInterceptor } from '../../interceptors/serialize.interceptor';
import { CreateUserDto } from '../dtos/create-user-dto';
import { UserDto } from '../dtos/user-dto';
import { User } from '../entities/users.entity';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}

    @Post('/signup')
    async signUp(@Body() body: CreateUserDto) {
        return await this.authService.signUp(body);
    }

    @Post('/signin')
    async signIn(@Body() body: Pick<CreateUserDto, 'email' | 'password'>) {
        return await this.authService.signIn(body);
    }

    @Get('/whoami')
    async whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: string) {
        await this.usersService.remove(id);

        return {
            message: 'User deleted successfully',
        };
    }

    @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    async getUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);

        return {
            user,
        };
    }
    @Get()
    async findAllUsers(@Query('name') name: string) {
        console.log('name', name);
        const users = await this.usersService.findAll();

        return {
            users,
        };
    }
}
