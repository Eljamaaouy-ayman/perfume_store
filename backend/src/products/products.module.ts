import { Module } from "@nestjs/common"
import { ProductsController } from "./products.controller";
import { ProductService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Review } from "src/reviews/reviews.entity";

@Module({
    controllers: [ProductsController],
    providers: [ProductService],
    imports: [TypeOrmModule.forFeature([Product])]
})
export class ProductsModule {}