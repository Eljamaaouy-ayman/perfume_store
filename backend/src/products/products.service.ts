import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateProductDto } from "./dtos/create-product.dto"
import { UpdateProductDto } from "./dtos/update-product.dto"

type ProductType = {id: number, title: string, price: number}

@Injectable()
export class ProductService{
    private products: ProductType[] = [
            {id : 1, title: 'book', price: 10},
            {id : 2, title: 'pen', price: 5},
            {id : 3, title: 'laptop', price: 400},
        ]
    
    /**
     * create new product
     */
    public createNewProducts({title, price} : CreateProductDto){
        const newProduct: ProductType = {
            id : this.products.length + 1,
            title,
            price
        }
        console.log(title, price)
        this.products.push(newProduct)
        return newProduct
    }

    /**
     * get all the products
     */
    public getAll() {
        return this.products
    }


    /**
     * get single product by id
     */
    public getProductBy(id :number) {
        const product =  this.products.find(p => p.id === id)
        if (!product)
            throw new NotFoundException()
        return product
    }


    /**
     * update product
     */
    public Update(id :string, updateProductDto : UpdateProductDto) {
        const product =  this.products.find(p => p.id === parseInt(id))
        if (!product)
            throw new NotFoundException()
        console.log(updateProductDto)
        return {message : "product updated successfully id : " + id }
    }


    /**
     * delete product
     */
    public Delete(id :string) {
        const product =  this.products.find(p => p.id === parseInt(id))
        if (!product)
            throw new NotFoundException()
        return { message : "product deleted"}
    }
}