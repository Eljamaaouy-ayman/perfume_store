import { UserType } from 'src/utils/enums';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadType, accessTokenType } from 'src/utils/types';

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
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

        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

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
        
        const accessToken = await this.generateJWTToken({id: user.id, usertype:user.userType})
        return {accessToken}
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
     * get all the users from the database
     * @returns collection of users
     */
    public getAll(): Promise<User[]>{
        return this.usersRepository.find()
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
