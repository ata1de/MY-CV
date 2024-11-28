import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/users.entity';

export class UpdateUserDto extends PartialType(User) {}
