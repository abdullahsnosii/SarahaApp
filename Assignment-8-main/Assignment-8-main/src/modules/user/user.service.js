import { deleteOne, findById, findOne, updateOne } from "../../common/repository/db.repository.js"
import { UserModel } from "../../DB/model/user.model.js"

export const updateUser = async ({name , email , age } , {id})=>{
   

const doc = await findById({ id , model:UserModel })
if(!doc)  throw new Error("User not found" ,{cause:{status:404}})
 
const checkEmail = await findOne({model:UserModel , filter:{email : email} })
if(checkEmail)  throw new Error("Email already exists" ,{cause:{status:409}})

const user = await updateOne({model:UserModel , filter:{_id:id} , update:{$set:{name , email , age }}}) 
return user
}

export const deleteUser = async ({id})=>{

const doc = await findById({ id , model:UserModel })
if(!doc)  throw new Error("User not found" ,{cause:{status:404}})
 
const user = await deleteOne({ filter:{_id:id} , model:UserModel })
return user
}

export const getUserById = async ({id})=>{

const doc = await findById({ id , model:UserModel })
if(!doc)  throw new Error("User not found" ,{cause:{status:404}})
 return doc
}