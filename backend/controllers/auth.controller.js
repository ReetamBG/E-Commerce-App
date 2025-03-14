import User from "../models/user.model.js"
import redis from "../lib/redis.js"
import jwt from "jsonwebtoken"

// generate tokens with userId as payload
const generateToken = (userId)=>{
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_JWT_KEY, {expiresIn: "15m"})
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_JWT_KEY, {expiresIn: "1h"})
    return {accessToken, refreshToken}
}

// send acces and refresh token in cookies
const setCookie = (res, accessToken, refreshToken)=>{
    res.cookie(
        "accessToken", accessToken,
        {
            maxAge: 15 * 60 * 1000,                             // gets deleted after 15m (optional as we already set jwt ttl)
            httpOnly: true,                                     // prevents XSS attacks (no idea wtf is this)
            secure: process.env.NODE_ENV === "production",      // send over https if in production mode
            sameSite: "strict"                                  // prevents CSRF attacks (no idea wtf is this)
        } 
    )
    res.cookie(
        "refreshToken", refreshToken,
        {
            maxAge: 7 * 24 * 60 * 60 * 1000,                    // gets deleted after 7days
            httpOnly: true,                                     
            secure: process.env.NODE_ENV === "production",      
            sameSite: "strict"                                 
        } 
    )
}

// store refresh tokens in redis
const storeRefreshToken = async (userId, refreshToken)=>{
    await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60)     // expires in 7 days (EX => seconds)
}


// signup
const signup = async (req, res)=>{
    try{
        const {name, email, password} = req.body
        const userExists = await User.findOne({email})                  // note {email} becomes {email: email}
        if(userExists){
            return res.status(400).json({message: "User Email already exists"})
        }
        const user = await User.create({name, email, password})         // create user
        const {accessToken, refreshToken} = generateToken(user._id)     // create token based on user id
        setCookie(res, accessToken, refreshToken)                       // store access token in cookies
        await storeRefreshToken(user._id, refreshToken)                 // store refresh token in Redis
        
        res.status(201).json(
            {
                user: {
                    userId: user._id,
                    userName: user.name, 
                    userEmail: user.email,
                    userRole: user.role
                },
                message: "Signup successful"
            }
        )
    }
    catch(error){
        console.log("Error in signup controller" + error)
        res.status(500).json({message: error.message})
    }
}


// login
const login = async(req, res)=>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})

        if(user && (await user.comparePassword(password))){
            const {accessToken, refreshToken} = generateToken(user._id)     // create token based on user id
            setCookie(res, accessToken, refreshToken)                       // store access token in cookies
            await storeRefreshToken(user._id, refreshToken)                 // store refresh token in Redis
            res.status(200).json(
                {
                    user: {
                        userId: user._id,
                        userName: user.name, 
                        userEmail: user.email,
                        userRole: user.role
                    },
                    message: "Login successful"
                }
            )
        }
        else{
            res.status(401).json({message: "Invalid email or password"})
        }
    }
    catch(error){
        console.log("Error in login controller: " + error)
        res.status(500).json({message: error.message})
    }
}


// logout - allow logout only if access token given
const logout = async (req, res)=>{
    try{
        const accessToken = req.cookies.accessToken
        if(!accessToken){
            return res.status(401).json({message: "Invalid Credentials"})  
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_JWT_KEY)
        const userId = decoded.userId
        await redis.del(`refreshToken:${userId}`)       // clear refresh token from redis
        res.clearCookie("accessToken")                  // clear access token from cookie
        res.clearCookie("refreshToken")                 // clear refresh token from cookie
        res.status(200).json({message: "Logged out successfully"})
    }
    catch(error){
        console.log("Error in logout controller: " + error)
        res.status(500).json({message: error.message})
    }
}


// refresh access token 
// get the refresh token from cookies, check if it matches with the redis one, then provide new access token
const refreshAccessToken = async (req, res)=>{
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return res.status(401).json({message: "No refresh token provided"})
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_JWT_KEY)
        const userId = decoded.userId
        const storedToken = await redis.get(`refreshToken:${userId}`)
        if(storedToken !== refreshToken){            // compare cookie refreshToken with redis refreshToken
            return res.status(401).json({message: "Invalid refresh token"})
        } 
        const newAccessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_JWT_KEY, {expiresIn: "15m"})
        res.cookie(
            "accessToken", newAccessToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            }
        )
        res.status(200).json({message: "Access token refreshed successfully"})
    }
    catch(error){
        console.log("Error in refreshAccessToken controller: " + error)
        res.status(500).json({message: error.message})
    }
}

export {signup, login, logout, refreshAccessToken}