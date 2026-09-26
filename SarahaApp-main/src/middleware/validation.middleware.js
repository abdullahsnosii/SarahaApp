import { BadException } from "../common/exceptions/error.exception.js";


export const validation = (schema)=>{
    return (req , res , next)=>{
       const validationResult = schema.safeParse(req.body)
       console.log({validationResult});
       if(!validationResult.success) throw BadException("validation Error" , validationResult.error.issues)

         req.validate = validationResult.data
         next()
    }

   
}