import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';


export class UpdateProductDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @IsOptional()
    @ApiPropertyOptional()
    title : string;
    
    @IsString()
    @ApiPropertyOptional()
    @MinLength(5)
    @IsOptional()
    description?: string;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiPropertyOptional()
    @IsOptional()
    @Min(0, {message: "the price must be more than 0"})
    price : number;
}