import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

// verifies access token and sends user to adminRoute() middleware
export const protectRoute = async (req, res, next)=>{
    try{
        const accessToken = res.cookies.accessToken
        if(!accessToken){
            return res.status(401).json({message: "Unauthorized - No access token provided"})
        }
        const decoded = jwt.decode(accessToken, process.env.ACCESS_TOKEN_JWT_KEY)
        const userId = decoded.userId

        // attach user details to req for adminRoute middleware
        const user = await User.findOne({userId}).select("-password")
        if(!user){
            return res.status(401).json({message: "User not found"})
        }
        req.user = user
        next()
    }
    catch(error){
        console.log("Error in protectRoute middleware" + error.message)
        res.status(500).json({message: error.message})
    }
}

// verifies if user is admin - takes in user details from protectRoute 
export const adminRoute = (req, res, next)=>{
    if(req.user && req.user.role === "admin"){
        next()
    }
    else{
        res.status(401).json({message: "Access denied - Admins only"})
    }
}