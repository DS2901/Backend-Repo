import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken"
const userSchema= new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true, 
            lowercase:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,
            required:true
        },
        coverimage:{
            type:String,
        },
        watcharray:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            typr:String,
            required:[true, "password is required"]
        },
        refreshtokeen:{
            type:String
        }

    },{timestamps:true}
)


userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(thi.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect= async function
(passwword){
    return  await  bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken= async function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken= async function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User= mongoose.model("User",userSchema);