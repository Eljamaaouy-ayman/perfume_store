import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MailService } from "src/mail/mail.service";
import { AuthProvider } from "src/users/auth.provider";
import { RegisterDto } from "src/users/dtos/register.dto";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";

jest.mock('@nestjs/jwt', () => ({
    JwtService: jest.fn().mockImplementation(() => ({
        sign: jest.fn(),
        verify: jest.fn(),
        decode: jest.fn(),
    })), 
}));
describe("auth provider", () => {
    let authProvider: AuthProvider
    let userRepository: Repository<User>
    let mailService: MailService
    let configService: ConfigService
    const REPOSITORY_TOKEN = getRepositoryToken(User)
    const registerDto: RegisterDto = {
        email: 'eljamaaouy@gmail.com',
        username: 'eljamaaouy',
        password: '123456'
    }

    beforeEach(async () => {
        const module : TestingModule = await Test.createTestingModule({
            providers: [
                AuthProvider,
                {provide : JwtService, useValue: {}},
                {provide : MailService, useValue: {
                    verifyEmail: jest.fn()
                }},
                {provide : ConfigService, useValue: {
                    get: jest.fn()
                }},
                {provide: REPOSITORY_TOKEN, useValue: {
                    findOne: jest.fn(),
                    create: jest.fn((dto: RegisterDto) => Promise.resolve(dto)),
                    save: jest.fn((user: User) => Promise.resolve({userId: 1, ...user}))
                }}
            ]
        }).compile();

        authProvider = module.get<AuthProvider>(AuthProvider)
        userRepository = module.get<Repository<User>>(REPOSITORY_TOKEN)
        mailService = module.get<MailService>(MailService)
        configService = module.get<ConfigService>(ConfigService)

    })
    it("should authProvider be defined", () => {
        expect(authProvider).toBeDefined()
    })

    it("should userRepository be defined", () => {
        expect(userRepository).toBeDefined()
    })

    describe("register()", () => {
        it("should call 'findOne' method in users repository", async () => {
            await authProvider.register(registerDto)
            expect(userRepository.findOne).toHaveBeenCalled()
            expect(userRepository.findOne).toHaveBeenCalledTimes(1)
        })

        it("should call 'create' method in users repository", async () => {
            await authProvider.register(registerDto)
            expect(userRepository.create).toHaveBeenCalled()
            expect(userRepository.create).toHaveBeenCalledTimes(1)
        })

        it("should call 'create' method in users repository", async () => {
            await authProvider.register(registerDto)
            expect(userRepository.save).toHaveBeenCalled()
            expect(userRepository.save).toHaveBeenCalledTimes(1)
        })

        it("should call 'verifyEmail' method in mail service", async () => {
            await authProvider.register(registerDto)
            expect(mailService.verifyEmail).toHaveBeenCalled()
            expect(mailService.verifyEmail).toHaveBeenCalledTimes(1)
        })

        it("should call 'get' method in config service", async () => {
            await authProvider.register(registerDto)
            expect(configService.get).toHaveBeenCalled()
            expect(configService.get).toHaveBeenCalledTimes(1)
        })
    })
})