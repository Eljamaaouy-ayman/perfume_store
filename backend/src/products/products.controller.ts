import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, ParseIntPipe, ValidationPipe } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ProductService } from "./products.service";
type ProductType = { id : number, title : string, price : number}

@Controller("api/products")
export class ProductsController {
    constructor(private readonly productService: ProductService){}

    private products: ProductType[] = [
        {id : 1, title: 'book', price: 10},
        {id : 2, title: 'pen', price: 5},
        {id : 3, title: 'laptop', price: 400},
    ]
    // POST: /~/api/products
    @Post()
    public createNewProducts(@Body() Body : CreateProductDto){
        return this.productService.createNewProducts(Body)
    }

    // GET: ~/api/products
    @Get()
    public getAllProducts() {
        return this.productService.getAll()
    }


    // GET: ~/api/products/:id
    @Get(":id")
    public getSingleProduct(@Param("id", ParseIntPipe) id :number) {
        return this.productService.getProductBy(id)
    }

    // PUT: ~/api/products/:id
    @Put(":id")
    public putSingleProduct(@Param("id") id :number, @Body() Body : UpdateProductDto) {
        return this.productService.Update(id, Body)
    }

    // DELETE: ~/api/products/:id
    @Delete(":id")
    public DeleteProduct(@Param("id") id :number) {
        return this.productService.Delete(id)
    }
}