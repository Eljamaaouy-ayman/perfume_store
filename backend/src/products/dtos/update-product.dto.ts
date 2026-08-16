import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';


export class UpdateProductDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @IsOptional()
    title : string;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    @Min(0, {message: "the price must be more than 0"})
    price : number;
}