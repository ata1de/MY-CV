import { User } from '@users/entities/users.entity';
import { Exclude, Expose, Transform } from 'class-transformer';

export class ReportDto {
    @Exclude()
    user: User;

    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number;
}
