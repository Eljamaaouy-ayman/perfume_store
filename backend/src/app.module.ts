import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductsModule } from './products/products.modules';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: 'yuoaam1jlE',
      port:5432,
      host: 'localhost',
      synchronize: true,
      entities: []
    })
  ],
})
export class AppModule {}
