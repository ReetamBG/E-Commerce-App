import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"]
        },
        description: {
            type: String,
            required: false,
            default: ""
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: 0
        },
        image: {
            type: String,       // image will be a Cloudinary URL
            required: [true, "Product image is required"]
        },
        category: {
            type: String,
            required: [true, "Product category is required"]
        },
        isFeatured: {
            type: Boolean,
            default: false
        }
    },

    // optional attributes
    {
        timestamps: true
    }
) 

const Product = mongoose.model("Product", productSchema)

export default Product