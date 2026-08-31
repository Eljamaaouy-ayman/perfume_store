import { UserType } from 'src/utils/enums';
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JWTPayloadType, accessTokenType } from 'src/utils/types';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthProvider } from './auth.provider';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';


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
    public async register (registerDto: RegisterDto): Promise<accessTokenType>{
        return this.authProviAuthProvider.register(registerDto)
    }

    /**
     * log in user
     * @param loginDto data for log in user
     * @returns jwt access token
    */
    public async login (loginDto: LoginDto): Promise<accessTokenType>{
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

}
