import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "./products.service";
import { UsersService } from "../users/users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dtos/create-product.dto";
type ProductType = {id: number, title: string, price: number}
type Options = {where: {title?: string, minprice?: number, maxprice?: number}}

// products/products.service.spec.ts
jest.mock('@nestjs/jwt', () => ({
    JwtService: jest.fn().mockImplementation(() => ({
        sign: jest.fn(),
        verify: jest.fn(),
        decode: jest.fn(),
    })), 
}));
describe('ProductsService', ()  => {
    let productRepository: Repository<Product>
    let productsService: ProductService
    const REPOSITORY_TOKEN = getRepositoryToken(Product)
    const createProductDto: CreateProductDto = {
        title: 'book',
        description: "about this book",
        price: 10
    }
    let productsArray: ProductType[]
    productsArray = [
        {id: 1, title: "p1", price: 10},
        {id: 2, title: "p2", price: 20},
        {id: 3, title: "p3", price: 30},
        {id: 4, title: "p4", price: 40},
    ]
    beforeEach( async () => {
        
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: UsersService, useValue: {
                    getCurrentUser: jest.fn((userId: number) => Promise.resolve({id : userId}))
                } },
                { 
                    provide: REPOSITORY_TOKEN,
                     useValue: {
                        create: jest.fn((dto: CreateProductDto) => dto),
                        save: jest.fn((dto: CreateProductDto) => Promise.resolve({ ...dto, id: 1 })),
                        find: jest.fn((options?: Options) => {
                            if(options?.where.title) return Promise.resolve([productsArray[0], productsArray[1]])
                            return Promise.resolve(productsArray)
                        })
                     } 
                    }
            ]
        }).compile();

        productsService = module.get<ProductService>(ProductService)
        productRepository = module.get<Repository<Product>>(REPOSITORY_TOKEN)
    })

    it("should product service be defined", () => {
        expect(productsService).toBeDefined()
    })

    it("should product repository be defined", () => {
        expect(productRepository).toBeDefined()
    })

    describe('createProduct()', () => {
        it("should call 'create' method in product repository", async () => {
            await productsService.createNewProducts(createProductDto, 1)
            expect(productRepository.create).toHaveBeenCalled()
            expect(productRepository.create).toHaveBeenCalledTimes(1)
        }),
        it("should call 'save' method in product repository", async () => {
            await productsService.createNewProducts(createProductDto, 1)
            expect(productRepository.save).toHaveBeenCalled()
            expect(productRepository.save).toHaveBeenCalledTimes(1)
        }),
        it("should create new product", async () => {
            const result = await productsService.createNewProducts(createProductDto, 1)
            expect(result).toBeDefined()
            expect(result.title).toBe('book')
            expect(result.description).toBe('about this book')
        })
    })

    describe('getAll()', () => {
        it("should call 'find' method in product repository", async () => {
            const data = await productsService.getAll()
            expect(productRepository.find).toHaveBeenCalled()
            expect(productRepository.find).toHaveBeenCalledTimes(1)
        }),
        it("should return 2 arguments if an argument passed", async () => {
            const data = await productsService.getAll("book")
            expect(data).toHaveLength(2)
        }),
        it("should return 4 arguments if no argument passed", async () => {
            const data = await productsService.getAll()
            expect(data).toHaveLength(4)
            expect(data).toBe(productsArray)
        })

    })
})