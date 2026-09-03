import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(250)
    @ApiProperty()
    email: string;
}