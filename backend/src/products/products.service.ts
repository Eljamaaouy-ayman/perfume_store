import { ConfigModule, ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateProductDto } from "./dtos/create-product.dto"
import { UpdateProductDto } from "./dtos/update-product.dto"
import { Repository } from "typeorm"
import { Product } from "./product.entity"
import { InjectRepository } from "@nestjs/typeorm"


@Injectable()
export class ProductService{

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository : Repository<Product>,
        private readonly config: ConfigService
    ){}

    
    /**
     * create new product
     */
    public createNewProducts( dto : CreateProductDto){
        const newProduct = this.productsRepository.create(dto);
        return this.productsRepository.save(newProduct);
    }

    /**
     * get all the products
     */
    public getAll() {
        const sample = this.config.get<string>("SAMPLE")
        const sample1 = process.env.SAMPLE
        console.log({sample, sample1})
        return this.productsRepository.find()
    }


    /**
     * get single product by id
     */
    public async getProductBy(id :number) {
        const product = await this.productsRepository.findOne({where: {id}})
        if (!product)
            throw new NotFoundException()
        return product
    }


    /**
     * update product
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
     */
    public async Delete(id :number) {
        const product = await this.getProductBy(id)
        if(!product)
            throw new NotFoundException()
        await this.productsRepository.remove(product)
        return { message : 'product deleted successfully' }
    }
}