import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    title : string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0, {message: "the price must be more than 0"})
    price : number;
}