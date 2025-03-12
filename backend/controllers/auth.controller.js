import User from "../models/user.model.js"
import redis from "../lib/redis.js"
import jwt from "jsonwebtoken"

// generate tokens with userId as payload
const generateToken = (userId)=>{
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_JWT_KEY, {expiresIn: "15m"})
    const refreshToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_JWT_KEY, {expiresIn: "1h"})
    return {accessToken, refreshToken}
}

// store access token in cookies
const storeAccessToken = (res, accessToken)=>{
    res.cookie(
        "accessToken", accessToken,
        {
            maxAge: 15 * 60 * 60,                               // gets deleted after 15m (optional as we already set jwt ttl)
            httpOnly: true,                                     // prevents XSS attacks (no idea wtf is this)
            secure: process.env.NODE_ENV === "production",      // send over https if in production mode
            sameSite: "strict"                                  // prevents CSRF attacks (no idea wtf is this)
        } 
    )
}

// store refresh tokens in redis
const storeRefreshToken = async (userId, refreshToken)=>{
    await redis.set(`refreshToken:${userId}`, refreshToken)
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
        storeAccessToken(res, accessToken)                              // store access token in cookies
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
            storeAccessToken(res, accessToken)                              // store access token in cookies
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
        console.log("Error: " + error)
        res.status(500).json({message: error.message})
    }
}


// logout - allow logout only if access token given
const logout = async (req, res)=>{
    try{
        const accessToken = req.cookies.accessToken
        if(accessToken){
            const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_JWT_KEY)
            const userId = decodedAccessToken.userId
            await redis.del(`refreshToken:${userId}`)       // clear refresh token from redis
            res.clearCookie("accessToken")                  // clear access token from cookie
            res.status(200).json({message: "Logged out successfully"})
        }
        else{
            res.status(401).json({message: "Invalid Credentials"})
        }
    }
    catch(error){
        console.log("Error: " + error)
        res.status(500).json({message: error.message})
    }
}

export {signup, login, logout}