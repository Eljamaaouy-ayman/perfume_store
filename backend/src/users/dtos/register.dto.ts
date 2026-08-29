import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(250)
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    @Length(2, 150)
    username: string;
}