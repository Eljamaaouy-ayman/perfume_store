import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    @ApiProperty()
    newPassword: string;
    
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @ApiProperty()
    userId: number
    
    @IsNotEmpty()
    @MinLength(10)
    @IsString()
    @ApiProperty()
    resetPasswordToken: string
}