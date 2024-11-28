import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user-dto';
import { UpdateUserDto } from '../dtos/update-user-dto';
import { User } from '../entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async create(request: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(request);

        return this.usersRepository.save(user);
    }

    async findOne(email: string) {
        return this.usersRepository.findOne({
            where: {
                email,
            },
        });
    }

    async update(id: string, request: UpdateUserDto) {
        const user = await this.findOne(id);

        if (!user) {
            throw new Error('User not found');
        }

        Object.assign(user, request);
        return await this.usersRepository.save(user);
    }

    async remove(id: string) {
        const user = await this.findOne(id);

        if (!user) {
            throw new Error('User not found');
        }

        return this.usersRepository.remove(user);
    }

    async findAll() {
        return this.usersRepository.find();
    }
}
