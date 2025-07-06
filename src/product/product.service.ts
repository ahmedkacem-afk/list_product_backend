import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GoldPriceService } from "./gold-price.service";

import * as fs from "fs";
import * as path from "path";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel("Product") private readonly productModel: Model<any>,
    private readonly goldPriceService: GoldPriceService
  ) {}
  async getProducts(filters: {
    minPrice?: number;
    maxPrice?: number;
    minScore?: number;
  }): Promise<any> {
    try {
      const query: any = {};
      // filter by min score required
      if (filters.minScore !== undefined) {
        query.popularityScore = { $gte: filters.minScore };
      }

      const products = await this.productModel.find(query).exec();

      // Get gold price
      const goldPrice = await this.goldPriceService.getGoldPrice();

      const minPrice = filters.minPrice || 0;
      const maxPrice = filters.maxPrice || Number.MAX_SAFE_INTEGER;

      // Calculate prices for all products
      const productsWithPrices = products.map((product) => {
        const price =
          (product.popularityScore + 1) * product.weight * goldPrice;
        return {
          ...product.toObject(),
          price: price,
        };
      });

      // Filter by price range
      const filteredProducts = productsWithPrices.filter((product) => {
        return product.price >= minPrice && product.price <= maxPrice;
      });

      return filteredProducts;
    } catch (error) {
      console.error("Error fetching products:", error.message);
      throw new Error("Failed to fetch products");
    }
  }

  async seedProductsFromFile() {
    const filePath = path.join(__dirname, "..", "data", "products.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(rawData);

    try {
      await this.productModel.insertMany(products, { ordered: false });
    } catch (error) {
      console.error("Error seeding products from JSON file", error);
    }
  }
}
