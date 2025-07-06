import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class GoldPriceService {
  private goldPriceCache: {
    price: number;
    timestamp: number;
  } | null = null;

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly API_URL = "https://www.goldapi.io/api/XAU/USD";
  private readonly API_TOKEN = "goldapi-fmousmcrm4lp7-io";

  async getGoldPrice(): Promise<number> {
    // Check if we have cached data that's still valid
    if (
      this.goldPriceCache &&
      Date.now() - this.goldPriceCache.timestamp < this.CACHE_DURATION
    ) {
      console.log("Using cached gold price:", this.goldPriceCache.price);
      return this.goldPriceCache.price;
    }

    try {
      console.log("Fetching fresh gold price from API...");
      const response = await axios.get(this.API_URL, {
        headers: {
          "x-access-token": this.API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      const goldPrice = response.data.price_gram_24k;

      // Update cache
      this.goldPriceCache = {
        price: goldPrice,
        timestamp: Date.now(),
      };

      console.log("Fresh gold price fetched:", goldPrice);
      return goldPrice;
    } catch (error: any) {
      console.error("Error fetching gold price:", error.message);

      // If API fails but we have cached data, use it even if expired
      if (this.goldPriceCache) {
        console.log(
          "API failed, using stale cached price:",
          this.goldPriceCache.price
        );
        return this.goldPriceCache.price;
      }

      throw new Error("Failed to fetch gold price");
    }
  }

  // Method to calculate price for a specific weight
  async calculatePrice(weight: number): Promise<number> {
    const goldPrice = await this.getGoldPrice();
    return weight * goldPrice;
  }

  // Method to get current cached price without API call
  getCachedPrice(): number | null {
    return this.goldPriceCache?.price || null;
  }

  // Method to invalidate cache (useful for testing or manual refresh)
  invalidateCache(): void {
    this.goldPriceCache = null;
  }
}
