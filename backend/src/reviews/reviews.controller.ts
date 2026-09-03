import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import type { JWTPayloadType } from "src/utils/types";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

@Controller('api/reviews')
@ApiTags("Reviews")
export class ReviewsController {

    constructor(private readonly reviewsService : ReviewsService,
    ){}
    // POST: ~/api/reviews/:productId
    @Post(':productId')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @ApiSecurity('bearer')
    public createNewReview(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() body: CreateReviewDto,
        @CurrentUser() payload: JWTPayloadType
    ){
        return this.reviewsService.createReview(productId, payload.id, body)
    }

    //Get: ~/api/reviews
    @Get()
    public getAllReviews(
        @Query('pageNumber', ParseIntPipe)pageNumber: number,
        @Query('reviewPerPage', ParseIntPipe)reviewPerPAge: number
    ){
        return this.reviewsService.getAll(pageNumber, reviewPerPAge)
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
    @ApiSecurity('bearer')
    public updateReview(@Param('reviewId', ParseIntPipe) id: number, @CurrentUser() payload: JWTPayloadType, @Body() Body: UpdateReviewDto){
        return this.reviewsService.updateReview(id, payload, Body)
    }

    // DELETE: ~/api/reviews/:id
    @Delete(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @ApiSecurity('bearer')
    public deleteReview(@Param('id', ParseIntPipe)id: number, @CurrentUser() payload: JWTPayloadType){
        return this.reviewsService.delete(id, payload)
    }

}