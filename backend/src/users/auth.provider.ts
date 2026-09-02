import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { RegisterDto } from "./dtos/register.dto";
import { accessTokenType, JWTPayloadType } from "src/utils/types";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dtos/login.dto";
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthProvider{
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly config: ConfigService
    ){}

    /**
     * register new user
     * @param registerDto data about the new user
     * @returns jwt access token
     */
    public async register (registerDto: RegisterDto){
        const {email, username, password} = registerDto

        const userFromDb = await this.usersRepository.findOne({where: {email}})
        if (userFromDb) throw new BadRequestException("user already exist");

        const hashedpassword = await this.hashPassword(password)

        let newUser = this.usersRepository.create({
            email,
            password: hashedpassword,
            username,
            verificatoinToken: randomBytes(32).toString('hex')
        })

        newUser = await this.usersRepository.save(newUser)
        const link = this.generateLink(newUser.id, newUser.verificatoinToken)

        await this.mailService.verifyEmail(email, link)

        
        return { message: 'verification token has been sent to your email, please verify your email address' }
    }

    /**
     * log in user
     * @param loginDto data for log in user
     * @returns jwt access token
    */
    public async login (loginDto: LoginDto){
       const {email, password} = loginDto;
       
       const user = await this.usersRepository.findOne({where: {email}});
       if (!user) throw new BadRequestException("unvalid email or password")
        
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) throw new BadRequestException("unvalid email or password")
            
        if (!user.isAccountVerified){
            if (!user.verificatoinToken){
                user.verificatoinToken = randomBytes(32).toString('hex')
                const result = this.usersRepository.save(user)
            }
            const link = this.generateLink(user.id, user.verificatoinToken)
            await this.mailService.verifyEmail(email, link)

            return { message: 'verification token has been sent to your email, please verify your email address' }
        }
        const accessToken = await this.generateJWTToken({id: user.id, usertype: user.userType})

        await this.mailService.sendLoginMail(user.email)


        return {accessToken}
    }
    
    public async hashPassword(password: string){
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }

    public async sendResetPasswordLink(email: string){
        const user = await this.usersRepository.findOne({where: {email}})
        if (!user) throw new BadRequestException("there is no user with this email")

        user.resetPasswordToken = randomBytes(32).toString('hex')
        const result = await this.usersRepository.save(user)
        const resetLink = `${this.config.get<string>('CLIENT_DOMAIN')}/reset-password/${result.id}/${result.resetPasswordToken}`

        console.log(resetLink)
        await this.mailService.resetPassword(email, resetLink)
        return {message : "password reset link sent to your email, please check your inbox"}
    }
        
    public async getResetPasswordLink(userId: number, resetPasswordToken: string){
        const user = await this.usersRepository.findOne({where: {id: userId}})
        if (!user) throw new BadRequestException("unvalid link")
        
        if (!user.resetPasswordToken === null || user.resetPasswordToken === "" || user.resetPasswordToken !== resetPasswordToken)
            throw new BadRequestException("unvalid link")
        return { message: "valid link" }
    }

    public async resetPassword(dto: ResetPasswordDto){
        const { userId, newPassword, resetPasswordToken } = dto
        const user = await this.usersRepository.findOne({where: {id: userId}})
        if (!user) throw new BadRequestException("unvalid link")
        
        if (!user.resetPasswordToken === null || user.resetPasswordToken === "" || user.resetPasswordToken !== resetPasswordToken)
            throw new BadRequestException("unvalid link")
        const hashPassword = await this.hashPassword(newPassword)
        user.password = hashPassword
        user.resetPasswordToken  = ""
        await this.usersRepository.save(user)
        return { message: "password changes successfully, please log in" }
    }

    /**
     * generate JWT tokwn
     * @param payload JWT payload
     * @returns token
     */
    private generateJWTToken (payload: JWTPayloadType) : Promise<string>{
        return this.jwtService.signAsync(payload)
    }
    private generateLink(userId: number, token: string){
        return `${this.config.get<string>("DOMAIN")}/api/users/verify-email/${userId}/${token}`
    }
}