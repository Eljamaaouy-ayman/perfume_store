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

    /**
     * sending verify email template
     * @param email email of the registered user
     * @param link link with id of the user and verification token
     */
    public async verifyEmail(email: string, link : string){
        try{
            await this.mailerService.sendMail({
                to: email,
                from: `<no-reply@perfume-store.com>`,
                subject: "verify your account",
                template: "verify-email",
                context: {link}
            })
        }
        catch{
            console.log("error")
            throw new RequestTimeoutException()
        }
    }

    /**
     * sending reset password template
     * @param email email of the registered user
     * @param link link with id of the user and reset password token
     */
    public async resetPassword(email: string, resetPasswordLink : string){
        try{
            await this.mailerService.sendMail({
                to: email,
                from: `<no-reply@perfume-store.com>`,
                subject: "reset password",
                template: "reset-password",
                context: {resetPasswordLink}
            })
        }
        catch{
            console.log("error")
            throw new RequestTimeoutException()
        }
    }
}
