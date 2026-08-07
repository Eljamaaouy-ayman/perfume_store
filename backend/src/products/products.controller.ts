import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, ParseIntPipe } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
type ProductType = { id : number, title : string, price : number}

@Controller("api/products")
export class ProductsController {
    private products: ProductType[] = [
        {id : 1, title: 'book', price: 10},
        {id : 2, title: 'pen', price: 5},
        {id : 3, title: 'laptop', price: 400},
    ]
    // POST: /~/api/products
    @Post()
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
    @Get()
    public getAllProducts() {
        return this.products
    }


    // GET: ~/api/products/:id
    @Get(":id")
    public getSingleProduct(@Param("id", ParseIntPipe) id :number) {
        const product =  this.products.find(p => p.id === id)
        if (!product)
            throw new NotFoundException()
        return product
    }

    // PUT: ~/api/products/:id
    @Put(":id")
    public putSingleProduct(@Param("id") id :string, @Body() Body : UpdateProductDto) {
        const product =  this.products.find(p => p.id === parseInt(id))
        if (!product)
            throw new NotFoundException()
        console.log(product)
        return {message : "product updated successfully id : " + id }
    }

    // DELETE: ~/api/products/:id
    @Delete(":id")
    public DeleteProduct(@Param("id") id :string) {
        const product =  this.products.find(p => p.id === parseInt(id))
        if (!product)
            throw new NotFoundException()
        return { message : "product deleted"}
    }
}