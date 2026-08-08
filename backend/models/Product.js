import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: "Product must have at least 1 image",
      },
      required: true,
    },
    sizes: {
      type: [sizeSchema],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: "Product must have at least 1 size entry",
      },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
