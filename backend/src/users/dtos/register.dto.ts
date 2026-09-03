import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
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
    
    @IsOptional()
    @IsString()
    @Length(2, 150)
    @ApiProperty()
    username: string;
}