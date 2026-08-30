import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(250)
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    password: string;
}