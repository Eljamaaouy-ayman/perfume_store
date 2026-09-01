import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { User } from "src/users/user.entity";

@Injectable()
export class MailService{

    constructor(
        private readonly mailerService: MailerService
    ){

    }

    /**
     * sending email to the logged in user
     * @param email email of the logged in user
     */
    public async sendLoginMail(email: string){
        try{
            const today = Date.now()
            await this.mailerService.sendMail({
                to: email,
                from: `<no-reply@perfume-store.com>`,
                subject: "log in",
                template: "login",
                context: {email, today}
            })
        }
        catch{
            console.log("error")
            throw new RequestTimeoutException()
        }
    }
}
