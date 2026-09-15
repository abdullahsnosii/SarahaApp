import { createOne, findOne } from "../../common/repository/db.repository.js"
import { UserModel } from "../../DB/model/user.model.js"

export const signup = async ({name , email , password , phone , age})=>{

const doc = await findOne({model:UserModel , filter:{email} , select:"email"})
if(doc)  throw new Error("Email already exists" ,{cause:{status:409}})
 
const user = await createOne({model:UserModel , data:{name , email , password , phone , age} , options:{validateBeforeSave : true}})
return user
}

export const login = async ({  email , password })=>{

const doc = await findOne({model:UserModel , filter:{email , password}})
if(!doc)  throw new Error("Invalid email or password" ,{cause:{status:404}})
 return doc
}