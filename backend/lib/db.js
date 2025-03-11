import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_DB_URI)
        console.log(`MongoDB conncted: ${conn.connection.host}`)
    }
    catch(error){
        console.log(`Error connecting to MongoDB: ${error}`)
        process.exit(1)
    }
}