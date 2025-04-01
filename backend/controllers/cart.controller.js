import Product from "../models/product.model.js";

export const getCartItems = async (req, res)=>{
    try {
        const user = req.user                                               // user from the protectRoute middleware

        // const productIds = user.cartItems.map(item => item.product)         // get the product ids of the items in cart
        // const products = await Product.find({_id: {$in: productIds}})       // get the products
        
        // // add quantity of each item
        // const cartItems = user.cartItems.map(cartItem => {
        //     const product = products.find(product => product._id.toString() === cartItem.product.toString())
        //     return product ? {...product.toObject(), quantity: cartItem.quantity} : null
        // })


        // just use populate() why go through all this hassle
        // populate() is a method available on mongoose objects
        // that automatically replaces ObjectIds with the actual referenced documents.
        const userPopulated = await user.populate("cartItems.productId")        // populate the cartItems.product field of user
        const cartItems = userPopulated.cartItems.map((item)=>(
            {...item.productId.toObject(), quantity: item.quantity}             // appending quantity to product
        ))
        res.status(200).json({ cartItems })
    }
    catch(error) {
        console.log("Error in getCartProducts controller: " + error)
        res.status(500).json({message: error.message})
    }
}

export const addProduct = async (req, res)=>{
    try{
        const {productId} = req.body        // same as const productId = req.body.productId
        const {user} = req

        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({message: "Product not found"})
        }

        // check if item exists in cart - if yes then increase quantity else add item
        const existingItem = user.cartItems.find(item => item.productId.toString() === productId)
        if(existingItem){
            existingItem.quantity += 1
        }
        else{
            user.cartItems.push({productId: productId})
        }

        // user.markModified("cartItems");      // uncomment this if mongoose doesn't detect cartItems changes
        await user.save()
        res.status(200).json({cartItems: user.cartItems})
    }
    catch(error){
        console.log("Error in addProduct controller: " + error)
        res.status(500).json({message: error.message})
    }
}

export const updateQuantity = async (req, res)=>{
    try{
        const {productId, quantity} = req.body
        const {user} = req

        if(quantity < 0){
            return res.status(400).json({message: "Cannot add negative quantity items"})
        }
        const item = user.cartItems.find(item => item.productId.toString() === productId)
        if(!item){
            return res.status(404).json({message: "Item with given product id not found in cart"})
        }

        if(quantity === 0){
            // if quantity becomes 0 remove item
            user.cartItems = user.cartItems.filter(item => item.productId.toString() !== productId)
        }
        else {
            // find item and update quantity
            item.quantity = quantity
        }

        // user.markModified("cartItems");
        await user.save()
        res.status(200).json({cartItems: user.cartItems, message: "Product quantity updated"})
    }
    catch(error){
        console.log("Error in updateQuantity controller: " + error)
        res.status(500).json({message: error.message})
    }
}


// remove the item entirely
export const deleteItem = async (req, res)=>{
    try{
        const {id: productId} = req.params
        const user = req.user
        if(!productId){
            user.cartItems = []     // if product id not given clear cart completely
        }
        else{
            user.cartItems = user.cartItems.filter(item => item.productId.toString() !== productId)
        }

        // user.markModified("cartItems");
        await user.save()
        res.status(200).json({cartItems: user.cartItems, message: "Item deleted"})
    }
    catch(error){
        console.log("Error in deleteItem controller: " + error)
        res.status(500).json({message: error.message})
    }
}