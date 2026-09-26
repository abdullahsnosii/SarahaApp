import { createOne, findOne } from "../../common/repository/base.repository.js"
import { UserModel } from "../../DB/model/user.model.js"
import { BadException, ConflictException, NotfoundException } from "../../common/exceptions/error.exception.js"
import { compare, hash } from "../../common/security/hash.security.js"
import { encryption } from "../../common/security/encryption.security.js"
import { createLoginCredentials } from "../../common/security/token.security.js"
import { WEB_CLIENT_IDS } from "../../config.js"


 import {OAuth2Client} from 'google-auth-library';
import { ProviderEnum } from "../../common/enum/user.enum.js"
const client = new OAuth2Client();
async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: WEB_CLIENT_IDS
  });
  const payload = ticket.getPayload();
  if(!payload.email_verified) throw BadException("email not verified")
  return payload
}




export const signupWithGmail = async ({idToken , issuer})=>{

console.log({idToken});

const {name , email , picture} = await verifyGoogleAccount(idToken)
console.log({name , email , picture});

let status = 201;
const existAccount = await findOne({
    model:UserModel,
    filter:{email}
})

if (existAccount) {
    if (existAccount.provider != ProviderEnum.GOOGLE) {
        throw ConflictException("Invalid account provider")
    }
   
    return {status:201  , data: await createLoginCredentials({user:existAccount , issuer})}
}
 const user = await createOne({
    model:UserModel,
    data:{
        username:name,
        email,
        confirmEmail:new Date(),
        proveder:ProviderEnum.GOOGLE,
        image:picture
    }
 })
return  {status:200  , data:await createLoginCredentials({user:existAccount , issuer})}

}


export const signup = async ({email , password , username , phone})=>{

const duplicatedAccount = await findOne({
    model:UserModel ,
     filter:{email} ,
      options:{select:"email"}
    })

if(duplicatedAccount) throw ConflictException("Email exists")

const account = await createOne({
    model:UserModel ,         
     data:{
        email ,
         password:await hash(password),
          phone:await encryption(phone),
          username
        }
    })
return account
}


export const login = async ({email , password } , issuer)=>{
const account = await findOne({
    model:UserModel , 
    filter:{email , provider:ProviderEnum.SYSTEM} 
})
if(!account) throw  NotfoundException("not Exist")
const match = await compare(password , account.password)

if(!match) throw NotfoundException("not Exist")
return await createLoginCredentials({user:account , issuer})

}