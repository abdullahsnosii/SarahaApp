import { tokenTypeEnum } from "../common/enum/security.enum.js"
import { ForbiddenException, UnauthorizedException } from "../common/exceptions/error.exception.js"
import { basicAuth, decodeToken } from "../common/security/token.security.js"

export const authentication = (tokenType = tokenTypeEnum.ACCESS)=>{
    return async (req , res , next)=>{

    const {authorization} = req.headers
    console.log(authorization);
    if(!authorization) throw UnauthorizedException("Unauthorized Account")

    const [key , credential] = authorization.split(" ")
    console.log({key , credential});
    
    switch (key) {
        case "Basic":
            const [email , password] = Buffer.from(credential , "base64").toString().split(":")
            console.log({email , password});
            req.user = await basicAuth({email , password})
            break;

        case "Bearer":
            const {user , payload} = await decodeToken({authorization:credential , tokenType})
            req.user = user
            req.payload = payload
            break;

        default:
            next(new Error ("Invalid authentication schema" , {cause:{status:400}}))
            break;
    }


    next()
}
}



export const authorization = (accessRole)=>{
    return async (req , res , next)=>{

    if(req.user.role < accessRole) throw ForbiddenException("Forbidden Account")
     
     
    next()
}
}

// if i have specific Roles
// export const authorization = (accessRoles)=>{
//     return async (req , res , next)=>{

//     if(!accessRoles.icludes(req.user.role)) throw ForbiddenException("Forbidden Account")
     
     
//     next()
// }
// }