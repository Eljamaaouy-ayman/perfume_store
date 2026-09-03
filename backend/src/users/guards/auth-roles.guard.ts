import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from '@nestjs/config';
import { JWTPayloadType } from 'src/utils/types';
import { CURRENT_USER_KEY } from 'src/utils/constants';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/utils/enums';
import { UsersService } from '../users.service';

@Injectable()
export class AuthRolesGuard implements CanActivate{
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly reflector: Reflector,
        private readonly userService: UsersService
    ){}

    async canActivate(context: ExecutionContext){

        const roles : UserType[] = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()])

        if (!roles || roles.length === 0)
            return false
        const request: Request = context.switchToHttp().getRequest()
        const [type, token] = request.headers.authorization?.split(" ") ?? []
        if (token && type === "Bearer"){
            try{
                const payload : JWTPayloadType = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: this.config.get<string>("JWT_SECRET")
                    }
                )
                const user = await this.userService.getCurrentUser(payload.id)
                if (!user)
                    return false

                if(roles.includes(user.userType)){
                    request[CURRENT_USER_KEY] = payload
                    return true
                }

            }
            catch{
                throw new UnauthorizedException("access denied, unvalid token")
            }
        }
        else{
            throw new UnauthorizedException("access denied, no token provided")
        }
        return false
    }

}
