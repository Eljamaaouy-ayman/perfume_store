import { accessTokenType } from './../src/utils/types';
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { CreateProductDto } from '../src/products/dtos/create-product.dto'
import { Product } from '../src/products/product.entity'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { User } from '../src/users/user.entity'
import { UserType } from '../src/utils/enums'
import * as bcrypt from 'bcryptjs'
import { APP_PIPE } from '@nestjs/core';

describe('products controller e2e', () => {
    let app : INestApplication
    let dataSource: DataSource
    let productsToSave: CreateProductDto[]
    let accessToken: string
    let dto: CreateProductDto = { title: "book", description: "about this book", price: 10 }

    beforeEach(async () => {
        productsToSave = [
            {title: "book", description: "about this book", price: 10},
            {title: "caroet", description: "about this carpet", price: 100},
            {title: "chair", description: "about this chair", price: 200},
            {title: "laptop", description: "about this laptop", price: 800},
        ]
        const module : TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = module.createNestApplication();
        await app.init();
        dataSource = app.get(DataSource)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash("123456", salt)
        await dataSource.createQueryBuilder().insert().into(User).values([
            {username: 'admin', email: 'admin@email.com', userType: UserType.ADMIN, password: hash, isAccountVerified: true}
        ]).execute()

        const {body} = await request(app.getHttpServer()).post("/api/users/auth/login")
        .send({email: 'admin@email.com', password: "123456"})
        accessToken = body.accessToken

    })

    afterEach(async () => {
        await dataSource.createQueryBuilder().delete().from(Product).execute()
        await dataSource.createQueryBuilder().delete().from(User).execute()
        await app.close()
    })
    //POST: ~/api/products
    describe("POST", () => {


        it("should create a new product and save it in the database", async () => {


            const response = await request(app.getHttpServer()).post("/api/products").set("Authorization", `Bearer ${accessToken}`).send(dto)
            expect(response.status).toBe(201)
            expect(response.body.id).toBeDefined()
            expect(response.body).toMatchObject(dto)
        })

        it("should return 400 status code if title length smaller than 2", async () => {
            dto.title = "b"
            const response = await request(app.getHttpServer()).post("/api/products").set("Authorization", `Bearer ${accessToken}`).send(dto)
            expect(response.status).toBe(400)
        })

        it("should return 400 status code if price is negative", async () => {
            dto.title = "book"
            dto.price = -10
            const response = await request(app.getHttpServer()).post("/api/products").set("Authorization", `Bearer ${accessToken}`).send(dto)
            expect(response.status).toBe(400)
        })

        it("should return 401 status code if token is not provided", async () => {
            dto.title = "book"
            dto.price = 10
            const response = await request(app.getHttpServer()).post("/api/products").send(dto)
            expect(response.status).toBe(401)
        })


    })

    //GET: ~/api/products
    describe("GET", () => {
        it("should return all products from the database", async () => {
            await dataSource.createQueryBuilder().insert().into(Product).values(productsToSave).execute()

            const response = await request(app.getHttpServer()).get("/api/products");
            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(4)
        })

        it("should return products based on the title", async () => {
            await dataSource.createQueryBuilder().insert().into(Product).values(productsToSave).execute()

            const response = await request(app.getHttpServer()).get("/api/products?title=laptop");
            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(1)
        })

        it("should return products based on the minPrice and maxPrice", async () => {
            await dataSource.createQueryBuilder().insert().into(Product).values(productsToSave).execute()

            const response = await request(app.getHttpServer()).get("/api/products?minPrice=10&maxPrice=200");
            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(3)
        })
    })
})