import mongoose from "mongoose";
import bcrypt from "bcrypt"

// define the schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be atleast 6 characters long"]
        },
        cartItems: [
            {
                quantity: {
                    type: Number,
                    default: 1      // each item added starts with 1 quantity
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,       // foreign key
                    ref: "Product"
                }
            }
        ],
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer"
        }
    },
    
    // optional attributes
    {
        timestamps: true        // adds createdAt and updatedAt 
    }
)


// adding password hashing - runs this before saving userSchema
userSchema.pre("save", async function (next){           // here next is from mongoose middleware not express
    if(!this.isModified("password")) return next()      // if not modified do nothing
    
    try{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }
    catch(error){
        next(error)
    }
})

// adding function to validate the hashed password 
userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password)
}

// make the user model with name "User"
const User = mongoose.model("User", userSchema)

export default User