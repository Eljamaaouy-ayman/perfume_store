import { ConfigModule, ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateProductDto } from "./dtos/create-product.dto"
import { UpdateProductDto } from "./dtos/update-product.dto"
import { Between, Like, Repository } from "typeorm"
import { Product } from "./product.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { UsersService } from '../users/users.service';


@Injectable()
export class ProductService{

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository : Repository<Product>,
        private readonly usersService: UsersService
    ){}

    
    /**
     * create new product
     * @param userId the id of the user (admin)
     * @param dto data of the product
     * @returns the new product created
     */
    public async createNewProduct( dto : CreateProductDto, userId: number){
        const user = await this.usersService.getCurrentUser(userId)
        const newProduct = this.productsRepository.create({
            ...dto, 
            title: dto.title.toLowerCase(),
            user
        });
        return this.productsRepository.save(newProduct);
    }

    /**
     * get all the products
     * @returns collection of the products from the database
     */
    public getAll(title?: string, minPrice?: string, maxPrice?: string) {
        const filters = {
            ...(title ? {title: Like(`%${title.toLocaleLowerCase()}%`)} : {}),
            ...(minPrice && maxPrice) ? {price: Between(parseInt(minPrice), parseInt(maxPrice))} : {}
        }
        return this.productsRepository.find({where: filters})
    }


    /**
     * get single product by id
     * @param id id of the product
     * @returns the product from the database
     */
    public async getProductBy(id :number) {
        const product = await this.productsRepository.findOne({where: {id}})
        if (!product)
            throw new NotFoundException("product not found")
        return product
    }


    /**
     * update product
     * @param id the id of the product
     * @param dto the new data of the product
     * @returns the updated product
     */
    public async Update(id :number, dto : UpdateProductDto) {
        const product =  await this.getProductBy(id);
        if (!product)
            throw new NotFoundException()
        product.title = dto.title ?? product.title;
        product.description = dto.description ?? product.description;
        product.price = dto.price ?? product.price;
        return this.productsRepository.save(product);
    }


    /**
     * delete product
     * @param id id of the product
     * @returns a success message
     */
    public async Delete(id :number) {
        const product = await this.getProductBy(id)
        if(!product)
            throw new NotFoundException()
        await this.productsRepository.remove(product)
        return { message : 'product deleted successfully' }
    }
}