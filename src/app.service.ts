import { Injectable, OnModuleInit } from "@nestjs/common";
import { ProductService } from "./product/product.service";

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly productService: ProductService) {}

  async onModuleInit() {
    await this.productService.seedProductsFromFile();
  }
  getHello(): string {
    return "Hello World!";
  }
}
