import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ProductSchema } from "./product.schema";
import { GoldPriceService } from "./gold-price.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Product", schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, GoldPriceService],
  exports: [ProductService, GoldPriceService],
})
export class ProductModule {}
