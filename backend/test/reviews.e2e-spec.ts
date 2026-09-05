import { accessTokenType } from './../src/utils/types';
import { Body, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { Product } from '../src/products/product.entity'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { User } from '../src/users/user.entity'
import { UserType } from '../src/utils/enums'
import * as bcrypt from 'bcryptjs'
import { APP_PIPE } from '@nestjs/core';
import { CreateReviewDto } from '../src/reviews/dtos/create-review.dto';
import { Review } from '../src/reviews/reviews.entity';
import { CreateProductDto } from '../src/products/dtos/create-product.dto';

describe('reviews controller e2e', () => {
    let app : INestApplication
    let dataSource: DataSource
    let accessToken: string
    let createReviewDto: CreateReviewDto
    let productDto: CreateProductDto = { title: "book", description: "about this book", price: 10 }
    

    beforeEach(async () => {
        createReviewDto = {comment: 'thanks', rating: 4}
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
        await dataSource.createQueryBuilder().delete().from(Review).execute()
        await dataSource.createQueryBuilder().delete().from(User).execute()
        await app.close()
    })

    describe("it should create a new review and save it to the database", async () => {
        await request(app.getHttpServer())
        .post("/api/products")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(productDto)

        await request(app.getHttpServer())
        .post("/api/reviews")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(productDto)
    })
})