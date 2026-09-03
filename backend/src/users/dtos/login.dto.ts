import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(250)
    @ApiProperty()
    email: string;
    
    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    @ApiProperty()
    password: string;
}