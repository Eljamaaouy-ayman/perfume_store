import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import type { JWTPayloadType } from "src/utils/types";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enums";

@Controller('api/reviews')
export class ReviewsController {

    constructor(private readonly reviewsService : ReviewsService,
    ){}
    // POST: ~/api/reviews/:productId
    @Post(':productId')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public createNewReview(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() body: CreateReviewDto,
        @CurrentUser() payload: JWTPayloadType
    ){
        return this.reviewsService.createReview(productId, payload.id, body)
    }

    //Get: ~/api/reviews
    @Get()
    public getAllReviews(){
        return this.reviewsService.getAll()
    }

    //GET ~/api/reviews/:id
    @Get(':id')
    public getReviewById(@Param("id", ParseIntPipe) id: number){
        return this.reviewsService.getOneReview(id)
    }

    //PUT: ~/api/reviews/:reviewId
    // @Put(':reviewId')
    // public async updateReview()


}