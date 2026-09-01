import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, RequestTimeoutException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { RegisterDto } from "./dtos/register.dto";
import { accessTokenType, JWTPayloadType } from "src/utils/types";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dtos/login.dto";
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthProvider{
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ){}

    /**
     * register new user
     * @param registerDto data about the new user
     * @returns jwt access token
     */
    public async register (registerDto: RegisterDto): Promise<accessTokenType>{
        const {email, username, password} = registerDto

        const userFromDb = await this.usersRepository.findOne({where: {email}})
        if (userFromDb) throw new BadRequestException("user already exist");

        const hashedpassword = await this.hashPassword(password)

        let newUser = this.usersRepository.create({
            email,
            password: hashedpassword,
            username
        })

        newUser = await this.usersRepository.save(newUser)
        
        const accessToken = await this.generateJWTToken({id: newUser.id, usertype:newUser.userType})
        
        return {accessToken}
    }

    /**
     * log in user
     * @param loginDto data for log in user
     * @returns jwt access token
    */
    public async login (loginDto: LoginDto): Promise<accessTokenType>{
       const {email, password} = loginDto;
       
       const user = await this.usersRepository.findOne({where: {email}});
       if (!user) throw new BadRequestException("unvalid email or password")
        
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) throw new BadRequestException("unvalid email or password")
            
        const accessToken = await this.generateJWTToken({id: user.id, usertype: user.userType})

        await this.mailService.sendLoginMail(user.email)


        return {accessToken}
    }
    
    public async hashPassword(password: string){
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }
        
    /**
     * generate JWT tokwn
     * @param payload JWT payload
     * @returns token
     */
    private generateJWTToken (payload: JWTPayloadType) : Promise<string>{
        return this.jwtService.signAsync(payload)
    }
}