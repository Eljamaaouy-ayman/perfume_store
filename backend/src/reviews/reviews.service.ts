import { CreateReviewDto } from './dtos/create-review.dto';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./reviews.entity";
import { Repository } from "typeorm";
import { ProductService } from "src/products/products.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
        private readonly productService: ProductService,
        private readonly usersService: UsersService
    ){}

    /**
     * create new review
     * @param productId id of the product
     * @param userId id of the user created the review
     * @param createReviewDto data for creating the review
     * @returns the created review in the database
     */
    public async createReview(productId: number, userId: number, createReviewDto: CreateReviewDto){
        const product = await this.productService.getProductBy(productId)
        const user = await this.usersService.getCurrentUser(userId)

        const review = this.reviewRepository.create({ ...createReviewDto, product: {id: productId}, user: {id: userId}})
        const result = await this.reviewRepository.save(review)

        return {
            id: result.id,
            rating: result.rating,
            comment: result.comment,
            createdAt: result.createdAt,
            userId: result.user.id,
            productId: result.product.id
        }
    }

    /**
     * get all the reviews
     * @returns collection of reviews from the database
     */
    public getAll(){
        return this.reviewRepository.find()
    }

    public async getOneReview(id: number){
        const review = await this.reviewRepository.findOne({where : {id}})
        if (!review)
            throw new NotFoundException("reivew not found")
        return review
    }
    
}