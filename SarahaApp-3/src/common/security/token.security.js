import jwt from "jsonwebtoken";
import { ACCESS_ADMIN_TOKEN_SIGNUTURE, ACCESS_TOKEN_EXPIRES_IN, ACCESS_USER_TOKEN_SIGNUTURE, REFRESH_ADMIN_TOKEN_SIGNUTURE, REFRESH_TOKEN_EXPIRES_IN, REFRESH_USER_TOKEN_SIGNUTURE } from "../../config.js";
import { BadException, NotfoundException, UnauthorizedException } from "../exceptions/error.exception.js";
import { findById, findOne } from "../repository/base.repository.js";
import { UserModel } from "../../DB/model/user.model.js";
import { tokenTypeEnum } from "../enum/security.enum.js";
import { RoleEnum } from "../enum/user.enum.js";
import { compare } from "./hash.security.js";
import {randomUUID} from 'node:crypto'
import { exist, set } from "../services/index.js";

export const userBaseKey = ({userId })=>{
  return `User::${userId.toString()}`
}



export const userBaseRevokeTokenKey = ({userId , jti})=>{
  return `${userBaseKey({userId})}::Revoke_Token`
}


export const userRevokeTokenKey = ({userId , jti})=>{
  return `${userBaseRevokeTokenKey({userId})}::${jti}`
}

export const createToken = async ({
payload={},
secret_key=ACCESS_USER_TOKEN_SIGNUTURE,
options={}
}={}) => {
return jwt.sign(payload , secret_key , options)
}





export const verifyToken = async ({
token ="",
secret_key=ACCESS_USER_TOKEN_SIGNUTURE,
}={}) => {
return jwt.verify(token , secret_key )
}


const getTokenSignatures =  async({role = RoleEnum.USER}={})=>{
  let signatures ;  
  switch (role) {
    case RoleEnum.ADMIN:
      signatures = {accessSignature: ACCESS_ADMIN_TOKEN_SIGNUTURE , refreshSignature:REFRESH_ADMIN_TOKEN_SIGNUTURE}
      break;
    default:
      signatures = {accessSignature: ACCESS_USER_TOKEN_SIGNUTURE , refreshSignature:REFRESH_USER_TOKEN_SIGNUTURE}
      break;
  }
  return signatures
}

const getSignature = async({tokenType = tokenTypeEnum.ACCESS , role=RoleEnum.USER}={})=>{
  const signatures = await getTokenSignatures({role})
  return tokenType == tokenTypeEnum.ACCESS ? signatures.accessSignature : signatures.refreshSignature
}


export const decodeToken = async ({
authorization = "",
tokenType = tokenTypeEnum.ACCESS
}={})=>{

const decoded = jwt.decode(authorization)
console.log(decoded);

if(!decoded?.aud?.length) throw BadException("missing decoded payload")

const payload = await verifyToken({
  token:authorization ,
   secret_key: await getSignature({tokenType , role:decoded.aud[0]})
  })

if(!payload?.sub) throw BadException("missing token payload")

if(await exist({key:userRevokeTokenKey({userId : payload.sub , jti : payload.jti})})){
  throw UnauthorizedException("Expired login credentials")
}

const user = await findById({
  model:UserModel,
  id:payload.sub
})

if(!user) throw NotfoundException("Invalid user")

console.log({change:user.changeCredentialsTime?.getTime() , iat:payload.iat*1000} );
if((user.changeCredentialsTime?.getTime() ?? 0) > payload.iat*1000){
  throw UnauthorizedException("Expired login credentials")
}
return {user , payload}

}






export const createLoginCredentials = async({
  user,
  issuer,
  options={}
  

})=>{

  const {accessSignature , refreshSignature} = await getTokenSignatures({role : user.role})
  const jwtid = randomUUID()
  const access_token = await createToken({
    payload:{sub : user._id},
    secret_key:accessSignature,
    options:{
      ...options,
      issuer,
      audience:[user.role],
       expiresIn:ACCESS_TOKEN_EXPIRES_IN,
       jwtid
      }
  })
  
  const refresh_token = await createToken({
    payload:{sub : user._id},
    secret_key:refreshSignature ,
    options:{
       ...options,
       issuer,
       audience:[user.role],
       expiresIn:REFRESH_TOKEN_EXPIRES_IN,
       jwtid
      },
     
  })
  console.log({accessSignature , refreshSignature});
  
  return {access_token , refresh_token}
}


export const createRevokeToken = async({payload})=>{
  const consumedTime = (Math.ceil(Date.now() /1000) -payload.iat)
  const refreshExpiredIn = payload.iat + REFRESH_TOKEN_EXPIRES_IN
  const ttl = refreshExpiredIn - consumedTime
  console.log({payload , consumedTime , refreshExpiredIn , ttl});
  await set({key:userRevokeTokenKey({userId:payload.sub , jti:payload.jti}) , value:payload.jti , ttl })
  return;
}



export const basicAuth = async ({email , password })=>{
const account = await findOne({
    model:UserModel , 
    filter:{email} 
})
if(!account) throw  NotfoundException("not Exist")
const match = await compare(password , account.password)

if(!match) throw NotfoundException("not Exist")
return await account

}



