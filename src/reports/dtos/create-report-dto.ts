import {
    IsDecimal,
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class CreateReportDto {
    @IsNotEmpty()
    @IsDecimal()
    @Min(0)
    @Max(1000000)
    price: number;

    @IsNotEmpty()
    @IsString()
    make: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1886)
    @Max(new Date().getFullYear())
    year: number;

    @IsNotEmpty()
    @IsLongitude()
    lng: number;

    @IsNotEmpty()
    @IsLatitude()
    lat: number;
}
