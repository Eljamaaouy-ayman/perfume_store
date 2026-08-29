import { forwardRef, Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./reviews.entity";

@Module({
    controllers: [ReviewsController],
    providers: [ReviewsService],
    exports: [ReviewsService],
    imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Review])]
})
export class ReviewsModule {}