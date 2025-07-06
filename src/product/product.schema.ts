import { Schema } from "mongoose";

export const ProductSchema = new Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  popularityScore: { type: Number, default: 0 },
  images: {
    yellow: String,
    rose: String,
    white: String,
  },
});

ProductSchema.set("toJSON", { virtuals: true });
