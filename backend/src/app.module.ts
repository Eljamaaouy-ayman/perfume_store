import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductsModule } from './products/products.modules';


@Module({
  imports: [ProductsModule, UsersModule, ReviewsModule],
})
export class AppModule {}
