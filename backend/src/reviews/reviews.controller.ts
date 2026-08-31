import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import type { JWTPayloadType } from "src/utils/types";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { UpdateReviewDto } from "./dtos/update-review.dto";

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
    @Put(':reviewId')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public updateReview(@Param('reviewId', ParseIntPipe) id: number, @CurrentUser() payload: JWTPayloadType, @Body() Body: UpdateReviewDto){
        return this.reviewsService.updateReview(id, payload, Body)
    }

    // DELETE: ~/api/reviews/:id
    @Delete(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public deleteReview(@Param('id', ParseIntPipe)id: number, @CurrentUser() payload: JWTPayloadType){
        return this.reviewsService.delete(id, payload)
    }

}