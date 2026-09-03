import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, ParseIntPipe, ValidationPipe, UseGuards, Query } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ProductService } from "./products.service";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import type { JWTPayloadType } from "src/utils/types";
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from "@nestjs/swagger";
type ProductType = { id : number, title : string, price : number}

@Controller("api/products")
@ApiTags("Products")
export class ProductsController {
    constructor(private readonly productService: ProductService){}

    // POST: /~/api/products
    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    @ApiSecurity('bearer')
    public createNewProducts(@Body() Body : CreateProductDto, @CurrentUser() payload: JWTPayloadType){
        return this.productService.createNewProducts(Body, payload.id)
    }

    // GET: ~/api/products
    @Get()
    @ApiOperation({summary: "get collection of products"})
    @ApiQuery({
        name: "title",
        required: false,
        type: "string",
        description: "search for products based on their name"
    })
    @ApiQuery({
        name: "minPrice",
        required: false,
        type: "string",
        description: "search for products based on their min price"
    })
    @ApiQuery({
        name: "maxPrice",
        required: false,
        type: "string",
        description: "search for products based on their max Price"
    })
    public getAllProducts(
        @Query('title') title: string,
        @Query('minPrice') minPrice: string,
        @Query('maxPrice') maxPrice: string
    ) {
        return this.productService.getAll(title, minPrice, maxPrice)
    }


    // GET: ~/api/products/:id
    @Get(":id")
    public getSingleProduct(@Param("id", ParseIntPipe) id :number) {
        return this.productService.getProductBy(id)
    }

    // PUT: ~/api/products/:id
    @Put(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    @ApiSecurity('bearer')
    public putSingleProduct(@Param("id") id :number, @Body() Body : UpdateProductDto) {
        console.log("produc updated")
        return this.productService.Update(id, Body)
    }

    // DELETE: ~/api/products/:id
    @Delete(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    @ApiSecurity('bearer')
    public DeleteProduct(@Param("id") id :number) {
        return this.productService.Delete(id)
    }
}