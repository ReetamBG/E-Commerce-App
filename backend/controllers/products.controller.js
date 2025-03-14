import Product from "../models/product.model.js"
import redis from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"

// get all products
export const getAllProducts = async (req, res)=>{
    try{
        const products = await Product.find({})       // {} => empty filter (everything will be selected)
        if(!products.length){
            return res.status(404).json({message: "No products found"})
        }
        res.status(200).json(products)
    }
    catch(error){
        console.log("Error in getAllProducts controller: " + error.message)
        res.status(500).json({message: error.message})
    }
}


// create product 
export const createProduct = async (req, res)=>{
    try{
        const {name, description, price, image, category} = req.body
        let cloudinaryResponse = null
        if(image){
            // stores the image and returns the cloudinary response (that contains the stored image URL) 
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"})      
        }
        
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })
        
        res.status(201).json({product, message: "Product added successfully"})
    }
    catch(error){
        console.log("Error in createProduct controller: " + error.message)
        res.status(500).json({message: error.message})
    }
}


// toggle featured product - using id 
export const toggleFeaturedProduct = async (req, res)=>{
    try{
        const productId = req.params.id
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({message: "Product not found"})
        }
        
        product.isFeatured = !product.isFeatured
        await product.save()

        // update featured products in redis
        const featuredProducts = await Product.find({isFeatured: true})
        await redis.set("featuredProducts", JSON.stringify(featuredProducts))
        res.status(200).json({product, message: "Featured status toggled"})
    }
    catch(error){
        console.log("Error in toggleFeaturedProduct controller: " + error)
        res.status(500).json({message: error.message})
    }
}


// delete product - using id 
export const deleteProduct = async (req, res)=>{
    try{
        const productId = req.params.id
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({message: "Product not found"})
        }

        // delete product from mongodb
        await Product.findByIdAndDelete(req.params.id)

        // delete image from cloudinary
        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(`products/${publicId}`)
            console.log("Product image deleted form cloudinary")
        }

        res.status(200).json({message: "Product deleted successfully"})

    }
    catch(error){
        console.log("Error in deleteProduct controller: " + error)
        res.status(500).json({message: error.message})
    }
}


// get featured products
export const getFeaturedProducts = async (req, res)=>{
    try{
        // search in redis cache first
        let featuredProducts = await redis.get("featuredProducts")
        if(featuredProducts){
           return res.json(JSON.parse(featuredProducts))   
           //redis stores items as strings so converting back to json using JSON.parse()
        }

        // if not in redis, fetch from mongodb and store in redis
        featuredProducts = await Product.find({isFeatured: true})
        if(!featuredProducts.length){
            return res.status(404).json({message: "No featured products found"})
        }
        await redis.set("featuredProducts", JSON.stringify(featuredProducts))
        // redis stores values as strings so using stringify() 
        res.json(featuredProducts)
    }
    catch(error){
        console.log("Error in getFeaturedProducts controller: " + error.message)
        res.status(500).json({message: error.message})
    }
}


// get products by category
export const getProductByCategory = async (req, res)=>{
    try{
        const category = req.params.category
        const products = await Product.find({category})
        res.status(200).json(products)
    }
    catch(error){
        console.log("Error in getProductByCategory controller: " + error.message)
        res.status(500).json({message: error.message})
    }
}