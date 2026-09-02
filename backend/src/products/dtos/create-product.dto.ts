import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @MinLength(2)
    title : string;
    
    @IsString()
    @ApiProperty()
    @MinLength(5)
    description: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    @Min(0, {message: "the price must be more than 0"})
    price : number;
}