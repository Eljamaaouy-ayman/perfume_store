import { IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    @IsOptional()
    password?: string;

    @IsOptional()
    @IsString()
    @Length(2, 150)
    @IsOptional()
    username?: string;
}