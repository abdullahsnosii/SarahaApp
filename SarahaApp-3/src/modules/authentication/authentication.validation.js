import {z} from "zod";
import { generalValidationFields } from "../../common/validation.js";

export const loginSchema = (lang)=>{
    return z.strictObject({
    email:generalValidationFields.email(lang),
    password:generalValidationFields.password(lang)
})
}



export const login = (lang)=>{
     return z.object({
    body:loginSchema(lang),
})
}




export const signup = (lang)=>{

    return  z.object({
    body: loginSchema(lang).safeExtend({
    username:generalValidationFields.username(lang),
    phone:generalValidationFields.phone(lang),
    confirmPassword:generalValidationFields.password(lang),
}).superRefine((data , ctx)=>{
console.log({data , ctx});

generalValidationFields.matchFields({original:"password" , copy :"confirmPassword" , data , ctx , lang})


if (!data.username.includes(" ")) {
    ctx.addIssue({
        code:"custom",
        path:['username'],
        message :"username must contain 2 parts"
    })
}
})
})
}



// .refine((data)=>{
// console.log(data);
// return data.password === data.confirmPassword
// },{message:"password mismatch with confirmation password"})


