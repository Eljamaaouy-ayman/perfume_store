import { CreateProductDto } from './dtos/create-product.dto';
import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductService } from "./products.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../users/users.service";
import { JWTPayloadType } from "../utils/types";
import { UserType } from "../utils/enums";
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dtos/update-product.dto';
type ProductTestType = {id : number, title: string, price: number}

jest.mock('@nestjs/jwt', () => ({
    JwtService: jest.fn().mockImplementation(() => ({
        sign: jest.fn(),
        verify: jest.fn(),
        decode: jest.fn(),
    })), 
}));

describe('ProductController', () => {
    let productController: ProductsController
    let productsService: ProductService
    const currentUser: JWTPayloadType = {id: 1, usertype: UserType.ADMIN}
    const createProductDto: CreateProductDto = {title: "book", description: "about this book", price: 10}
    let products: ProductTestType[]
    beforeEach(async () => {
        products = [
            { id: 1, title: "carpet", price: 10 },
            { id: 2, title: "laptop", price: 20 },
            { id: 3, title: "book", price: 30 },
            { id: 4, title: "pen", price: 40 }
        ]
        const module: TestingModule = await Test.createTestingModule({
            controllers:[ProductsController],
            providers: [
                { provide: ConfigService, useValue: {} },
                { provide: JwtService, useValue: {} },
                { provide: Reflector, useValue: {} },
                { provide: UsersService, useValue: {} },
                {
                    provide: ProductService,
                    useValue: {
                        createNewProduct: jest.fn((dto: CreateProductDto, userId: number) => Promise.resolve({ ...dto, id: 1 }) ),
                        getAll : jest.fn((title?: string, minPrice?: number, maxPrice?: number) => {
                            if (title) return Promise.resolve(products.filter(p => p.title === title))
                            if (minPrice && maxPrice) return Promise.resolve(products.filter(p => p.price >= minPrice && p.price <= maxPrice))
                            return Promise.resolve(products)
                        }),
                        getProductBy : jest.fn((id: number) => {
                            const product = products.find(p => p.id === id)
                            if (!product) throw new NotFoundException('product not found')
                            return Promise.resolve(product)
                        }),
                        Update: jest.fn((productId: number, dto: UpdateProductDto) => Promise.resolve({ ...dto, id: productId })),
                        Delete: jest.fn((productId: number) => true)
                    }
                }
            ]
        }).compile()

        productController = module.get<ProductsController>(ProductsController)
        productsService = module.get<ProductService>(ProductService)
         
    })
    it("should product controller be defined", () => {
        expect(productController).toBeDefined()
    })
    it("should product service be defined", () => {
        expect(productsService).toBeDefined()
    })

    describe('create new product', () => {
        it("should call 'createProduct' method in product service", async () => {
            await productController.createNewProducts(createProductDto, currentUser)
            expect(productsService.createNewProduct).toHaveBeenCalled()
            expect(productsService.createNewProduct).toHaveBeenCalledTimes(1)
            expect(productsService.createNewProduct).toHaveBeenCalledWith(createProductDto, currentUser.id)
        })

        it("should return a new product with the given data", async () => {
            const result = await productController.createNewProducts(createProductDto, currentUser)
            expect(result.id).toBe(1)
            expect(result).toMatchObject(createProductDto)
        })
    })

    describe('get all products', () => {
        it("it should call 'getAll' method in prouctsService", async ()=> {
            await productController.getAllProducts()
            expect(productsService.getAll).toHaveBeenCalled()
            expect(productsService.getAll).toHaveBeenCalledTimes(1)
        })

        it("it should return products based on title", async ()=> {
            const data = await productController.getAllProducts("book")
            expect(data).toHaveLength(1)
            expect(data[0].title).toBe("book")
        })

        it("it should return products based on minPrice & maxPrice", async ()=> {
            const data = await productController.getAllProducts(undefined, "20", "50")
            expect(data).toHaveLength(3)
        })
    })

    describe('get single product by id', () => {
        it ("should call 'getSingleProduct' method", async ()=> {
            await productController.getSingleProduct(1)
            expect(productsService.getProductBy).toHaveBeenCalled()
            expect(productsService.getProductBy).toHaveBeenCalledTimes(1)
            expect(productsService.getProductBy).toHaveBeenCalledWith(1)
        })

        it ("should return product by it's id", async ()=> {
            const product = await productController.getSingleProduct(1)
            expect(product.title).toBe("carpet")
            expect(productsService.getProductBy).toHaveBeenCalledTimes(1)
        })

        it ("should throw an exception if product was not found", async ()=> {
            expect.assertions;
            try{
                await productController.getSingleProduct(10)
            }
            catch(error) {
                expect(error).toMatchObject({message: 'product not found'}) 
            }
        })
    })
    describe("updateProdut()", () => {
        it("should call 'update' method", async () => {
            await productController.putSingleProduct(1, {title: "new carpet"})
            expect(productsService.Update).toHaveBeenCalled()
            // expect(productsService.Update).toHaveBeenCalledWith(2)
            expect(productsService.Update).toHaveBeenCalledTimes(1)
        })

        it("should change the title", async () => {
            const product = await productController.putSingleProduct(1, {title: "new carpet"})
            expect(product.title).toBe("new carpet")
        })
    })

    describe("deleteProduct()", () => {
        it("should call 'delete' method", async () => {
            await productController.DeleteProduct(1)
            expect(productsService.Delete).toHaveBeenCalled()
            expect(productsService.Delete).toHaveBeenCalledTimes(1)
        })

        it("should change the title", async () => {
            const product = await productController.DeleteProduct(1,)
            expect(product).toBe(true)
        })
    })
})