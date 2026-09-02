import {IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    newPassword: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    userId: number

    @IsNotEmpty()
    @MinLength(10)
    @IsString()
    resetPasswordToken: string
}