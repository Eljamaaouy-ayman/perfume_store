import { Controller, Get } from "@nestjs/common";

@Controller({})
export class UsersController {
    @Get('api/users')
    public getAllUsers(){
        return [
            {id: 1, email: "eljamaaouyayman@gmail.com"},
            {id: 2, email: "khaaledhihi@gmail.com"},
        ]
    }
}