import { Controller, Get } from "@nestjs/common";

@Controller({})
export class ReviewsController {
    // Get: ~/api/reviews
    @Get('api/reviews')
    public getAllReviews(){
        return [
            {id: 1, rating: 4, comment: "good"},
            {id: 2, rating: 3, comment: "okay"}
        ]
    }
}