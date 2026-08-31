import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { JWTPayloadType } from "src/utils/types";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "./guards/auth-roles.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { loggerInterceptor } from "src/utils/interceptors/logger.interceptor";

@Controller("api/users")
export class UsersController {

    constructor(private readonly usersService : UsersService,
    ){}


    // POST: ~/api/users/auth/register
    @Post("auth/register")
    public register(@Body() body: RegisterDto){
        return this.usersService.register(body)
    }

    // POST: ~/api/users/auth/login
    @Post("auth/login")
    @HttpCode(HttpStatus.OK)
    public login(@Body() body: LoginDto){
        return this.usersService.login(body)
    }

    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public getAllUsers(){
        return this.usersService.getAll()
    }

    @Put()
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @UseGuards(AuthRolesGuard)
    public updateUser(@CurrentUser() payload : JWTPayloadType, @Body() Body: UpdateUserDto){
        return this.usersService.updateUser(payload.id, Body)
    }

    @Delete(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public deleteUser(@Param("id", ParseIntPipe) id: number, @CurrentUser() payload: JWTPayloadType){
        return this.usersService.delete(id, payload)
    }

    @Get("current-user")
    @UseGuards(AuthGuard)
    public getCurrentUser(@CurrentUser() payload: JWTPayloadType){
        console.log("get current user route called")
        return this.usersService.getCurrentUser(payload.id)
    }
}