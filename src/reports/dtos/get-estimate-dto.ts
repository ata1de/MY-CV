import { Transform } from 'class-transformer';
import {
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class GetEstimateDto {
    @IsNotEmpty()
    @IsString()
    make: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    @IsNumber()
    @Min(1886)
    @Max(new Date().getFullYear())
    year: number;

    @Transform(({ value }) => parseFloat(value))
    @IsNotEmpty()
    @IsLongitude()
    lng: number;

    @Transform(({ value }) => parseFloat(value))
    @IsNotEmpty()
    @IsLatitude()
    lat: number;

    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;
}
