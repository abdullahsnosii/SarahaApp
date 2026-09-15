import mongoose from "mongoose";

 const noteSchema = new mongoose.Schema({
 
title:{
    type:String,
    required:true,
    validate:{
        validator:function(value){
            if(value == value.toUpperCase()){
                return false
            }
            return true
        },
        message:function(prop){
            return `Title connot be entirely uppercase`
        }
    }
},
content:{
    type:String,
    required:true
},
userId:{
    type:mongoose.Types.ObjectId ,
     ref :"User",
    required:true
}

    
 }

,{
timestamps:true,    
validateBeforeSave:true,
strictQuery:true,
strict:true,
autoIndex:true,
optimisticConcurrency:true
}
)


export const NoteModel = mongoose.models.NOte || mongoose.model("Note", noteSchema)