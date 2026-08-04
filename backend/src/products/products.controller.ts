import { Controller, Get, Post, Body, Param, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
type ProductType = { id : number, title : string, price : number}

@Controller({})
export class ProductsController {
    private products: ProductType[] = [
        {id : 1, title: 'book', price: 10},
        {id : 2, title: 'pen', price: 5},
        {id : 3, title: 'laptop', price: 400},
    ]
    // POST: /~/api/products
    @Post("api/products")
    public createNewProducts(@Body() Body : CreateProductDto){
        const newProduct: ProductType = {
            id : this.products.length + 1,
            title : Body.title,
            price : Body.price
        }
        this.products.push(newProduct)
        return newProduct
    }

    // GET: ~/api/products
    @Get("api/products")
    public getAllProducts() {
        return this.products
    }


    // GET: ~/api/products/:id
    @Get("api/products/:id")
    public getSingleProduct(@Param("id") id :string) {
        const product =  this.products.find(p => p.id === parseInt(id))
        if (!product)
            throw new NotFoundException()
        return product
    }
}