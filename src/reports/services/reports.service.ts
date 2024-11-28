import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from '@reports/dtos/create-report-dto';
import { GetEstimateDto } from '@reports/dtos/get-estimate-dto';
import { User } from '@users/entities/users.entity';
import { Repository } from 'typeorm';
import { Report } from '../entities/reports.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>
    ) {}

    async create(body: CreateReportDto, user: User) {
        const report = await this.reportsRepository.create({
            ...body,
            user,
        });

        return await this.reportsRepository.save(report);
    }

    async approveReport(approve: boolean, id: string, user: User) {
        const report = await this.reportsRepository.findOne({
            where: {
                id: Number(id),
                user,
            },
        });

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        report.approved = approve;

        return await this.reportsRepository.save(report);
    }

    async createEstimate({
        make,
        model,
        lng,
        lat,
        year,
        mileage,
    }: GetEstimateDto) {
        return this.reportsRepository
            .createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make })
            .andWhere('model = :model', { model })
            .andWhere('lng - :lng BETWEEN -5 and 5', { lng })
            .andWhere('lat - :lat BETWEEN -5 and 5', { lat })
            .andWhere('year - :year BETWEEN -5 and 5', { year })
            .orderBy('mileage - :mileage')
            .setParameters({ mileage })
            .limit(3)
            .getRawMany();
    }
}
