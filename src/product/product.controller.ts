import { Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get("products")
  async getProducts(
    @Query("minPrice") minPrice?: number,
    @Query("maxPrice") maxPrice?: number,
    @Query("minScore") minScore?: number
  ) {
    return this.productService.getProducts({
      minPrice,
      maxPrice,
      minScore,
    });
  }
}
