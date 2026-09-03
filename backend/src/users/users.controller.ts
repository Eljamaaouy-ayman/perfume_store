import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { JWTPayloadType } from "../utils/types";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "../utils/enums";
import { AuthRolesGuard } from "./guards/auth-roles.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { loggerInterceptor } from "../utils/interceptors/logger.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import type { Response } from "express";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ImageUploadDto } from "./dtos/image-upload.dto";

@Controller("api/users")
@ApiTags("Users")
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
    @ApiSecurity('bearer')
    public getAllUsers(){
        return this.usersService.getAll()
    }

    @Put()
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @UseGuards(AuthRolesGuard)
    @ApiSecurity('bearer')
    public updateUser(@CurrentUser() payload : JWTPayloadType, @Body() Body: UpdateUserDto){
        return this.usersService.updateUser(payload.id, Body)
    }

    @Delete(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @ApiSecurity('bearer')
    public deleteUser(@Param("id", ParseIntPipe) id: number, @CurrentUser() payload: JWTPayloadType){
        return this.usersService.delete(id, payload)
    }

    @Get("current-user")
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    public getCurrentUser(@CurrentUser() payload: JWTPayloadType){
        console.log("get current user route called")
        return this.usersService.getCurrentUser(payload.id)
    }

    //Post ~/api/users/upload-image
    @Post('upload-image')
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: ImageUploadDto, description: 'profile image' })
    @UseInterceptors(FileInterceptor('user-image'))
    public uploadProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() payload: JWTPayloadType
    ){
        if (!file) return new BadRequestException("no image provided")
        return this.usersService.setProfileImage(payload.id, file.filename)
    }

    // Delete ~/api/users/images/remove-profile-image
    @Delete("images/remove-profile-image")
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    public removeProfileImage(@CurrentUser() payload: JWTPayloadType){
        return this.usersService.removeProfileImage(payload.id)
    }

    // Get ~/api/users/images/profile-image
    @Get("images/:image")
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    public getProfileImage(@Param("image")image : string, @Res() res: Response){
        return res.sendFile(image, { root: "images/users" })
    }

    // GET ~/api/users/verify-email/:id/:verificatoinToken
    @Get("verify-email/:id/:verificationToken")
    public verifyEmail(@Param("id", ParseIntPipe) id : number, @Param("verificationToken") token: string){
        return this.usersService.verifyEmail(id, token)
    }

    // POST ~/api/users/forgot-password
    @Post("forgot-password")
    @HttpCode(HttpStatus.OK)
    public forgotPassword(@Body() body: ForgotPasswordDto){
        return this.usersService.sendResetPasswordLink(body.email)
    }
    
    // GET ~/api/users/reset-password/:id/:resetPasswordToken
    @Get("reset-password/:id/:resetPasswordToken")
    public getResetPassword(@Param("id", ParseIntPipe)id : number, @Param("resetPasswordToken") token: string){
        return this.usersService.getResetPassword(id, token)
    }

    // POST ~/api/users/reset-password
    @Post("reset-password")
    public resetPassword(@Body() body: ResetPasswordDto){
        return this.usersService.resetPassword(body)
    }

}