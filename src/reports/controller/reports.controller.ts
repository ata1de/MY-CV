import { CurrentUser } from '@decorators/currentUser.decorator';
import { AuthGuard } from '@guards/AuthGuard';
import { SerializeInterceptor } from '@interceptors/serialize.interceptor';
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApproveReportDto } from '@reports/dtos/approve-report-dto';
import { GetEstimateDto } from '@reports/dtos/get-estimate-dto';
import { ReportDto } from '@reports/dtos/report-dto';
import { User } from '@users/entities/users.entity';
import { CreateReportDto } from '../dtos/create-report-dto';
import { ReportsService } from '../services/reports.service';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query);
    }

    @Post()
    @UseInterceptors(new SerializeInterceptor(ReportDto))
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    approveReport(
        @Body() body: ApproveReportDto,
        @Param('id') id: string,
        @CurrentUser() user: User
    ) {
        return this.reportsService.approveReport(body.approved, id, user);
    }
}
