import { UserType } from 'src/utils/enums';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JWTPayloadType, accessTokenType } from 'src/utils/types';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthProvider } from './auth.provider';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { join } from 'node:path';
import { unlinkSync } from 'node:fs';
import { ResetPasswordDto } from './dtos/reset-password.dto';


@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly authProviAuthProvider: AuthProvider
    ){}



    /**
     * register new user
     * @param registerDto data about the new user
     * @returns jwt access token
     */
    public async register (registerDto: RegisterDto){
        return this.authProviAuthProvider.register(registerDto)
    }

    /**
     * log in user
     * @param loginDto data for log in user
     * @returns jwt access token
    */
    public async login (loginDto: LoginDto){
        return this.authProviAuthProvider.login(loginDto)
    }
    /**
     * get current user
     * @param id id of the current user
     * @returns current user from the database
     */
    public async getCurrentUser(id :number){
        const currentUser = await this.usersRepository.findOne({where: {id}})
        if (!currentUser) throw new NotFoundException("user not found");
        return currentUser
    }

    /**
     * 
     * @param id id of the logged in user
     * @param updateUser new data of the logged in user
     * @returns updated user from the database
     */
    public async updateUser(id : number, updateUser: UpdateUserDto){
        const { username, password } = updateUser
        const user = await this.usersRepository.findOne({where: {id}})

        if(user){
            user.username = username ?? user.username
            if (password){
                user.password = await this.authProviAuthProvider.hashPassword(password)
            }
            return this.usersRepository.save(user)
        }
    }

    /**
     * delete user
     * @param userId id of the user
     * @param payload JWTPayload
     * @returns success message
     */
    public async delete(userId: number, payload: JWTPayloadType){
        const user = await this.getCurrentUser(userId)
        if (user.id === payload?.id || payload.usertype === UserType.ADMIN){
            await this.usersRepository.remove(user)
            return { message: "user deleted successfully" }
        }
        throw new ForbiddenException("access denied, you are not allowed")

    }

    /**
     * get all the users from the database
     * @returns collection of users
     */
    public getAll(): Promise<User[]>{
        return this.usersRepository.find()
    }

    /**
     * upload user profile image
     * @param userId id of the user
     * @param newProfileImage new image of the user
     * @returns the user from the database
     */
    public async setProfileImage(userId: number, newProfileImage: string){
        const user = await this.getCurrentUser(userId)
        if (user.profileImage === null || user.profileImage === "")
            user.profileImage = newProfileImage || ""
        else{
            await this.removeProfileImage(userId)
            user.profileImage = newProfileImage || ""
        }
        return this.usersRepository.save(user)
    }

    /**
     * remove profile image
     * @param userId id of the logged in user
     * @returns user from the database
     */
    public async removeProfileImage(userId: number){
        const user = await this.getCurrentUser(userId)
        if (user.profileImage === null || user.profileImage === "")
            throw new BadRequestException("there is no profile image")
        const imagePath = join(process.cwd(), `/images/users/${user.profileImage}`)
        unlinkSync(imagePath)
        user.profileImage = ""
        return this.usersRepository.save(user)
    }

    /**
     * verify email
     * @param userId id of the user
     * @param verificationToken verification token
     * @returns success message
     */
    public async verifyEmail(userId : number, verificationToken: string){
        const user = await this.getCurrentUser(userId)

        if (user.verificatoinToken === null || user.verificatoinToken === "")
            throw new NotFoundException("verification token not found")

        if (user.verificatoinToken !== verificationToken)
            throw new BadRequestException("unvalid link")

        user.isAccountVerified = true
        user.verificatoinToken = ""

        await this.usersRepository.save(user)
        return { message: "your email has been successfully verified" }
    }

    /**
     * sending reset password link
     * @param email email of the user
     * @returns a success message
     */
    public sendResetPasswordLink(email: string){
        return this.authProviAuthProvider.sendResetPasswordLink(email)
    }

    /**
     * get the reset password
     * @param userId id of the user
     * @param resetPasswordToken token of the reset password
     * @returns success message
     */
    public getResetPassword(userId: number, resetPasswordToken: string){
        return this.authProviAuthProvider.getResetPasswordLink(userId, resetPasswordToken)
    }

    /**
     * reset the password
     * @param dto infos about the new password
     * @returns success message
     */
    public resetPassword(dto: ResetPasswordDto){
        return this.authProviAuthProvider.resetPassword(dto)
    }
}