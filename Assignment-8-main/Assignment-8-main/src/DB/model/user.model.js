import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({

name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
phone:{
    type:String,
    required:true
},
age:{
    type:Number,
    min:18,
    max:60
},

},
{
validateBeforeSave:true,
strictQuery:true,
strict:true,
autoIndex:true,
optimisticConcurrency:true
}
)

export const UserModel = mongoose.models.User || mongoose.model("User" , userSchema)