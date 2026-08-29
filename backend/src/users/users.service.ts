import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>
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

        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        let newUser = this.usersRepository.create({
            email,
            password: hashedpassword,
            username
        })

        newUser = await this.usersRepository.save(newUser)
        // TODO -> generate JWT token 
        return newUser
    }
}