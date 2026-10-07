import jwt from 'jsonwebtoken'
import { findByIdAndUpdate } from '../../common/repository/base.repository.js';
import { UserModel } from '../../DB/model/user.model.js';
import { createLoginCredentials, createRevokeToken, createToken, userBaseRevokeTokenKey, userRevokeTokenKey, verifyToken } from '../../common/security/token.security.js';
import { decryption } from '../../common/security/encryption.security.js';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN} from '../../config.js';
import { ConflictException } from '../../common/exceptions/error.exception.js';
import { del, keys, set } from '../../common/services/index.js';
import { LogoutEnum } from '../../common/enum/security.enum.js';

export const profile = async (user)=>{
user.phone = await decryption(user.phone)
return {user}
}

export const update = async (user , data)=>{
const account = findByIdAndUpdate({
    model:UserModel
     , id:user._id
      , update:data
    })
    
return account
}


export const rotateToken = async (payload , user , issuer)=>{
const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000
const currentTime = Date.now() + (5 * 6000)

if(currentTime < accessExpiresIn )
{
 throw ConflictException("sorry we cannot create new login credintials while current access token still within valid time range")
}

const data = await createLoginCredentials({user , issuer})
await createRevokeToken({payload})
return data
}



export const logout = async (payload , user , {action=LogoutEnum.DEVICE})=>{
  console.log({user});
  
  switch (action) {
    case LogoutEnum.ALL:
      user.changeCredentialsTime = new Date()
      await user.save()
      console.log({ kk:await keys({prefix: userBaseRevokeTokenKey({userId:payload.sub})})});
      
      await del({key: await keys({prefix: userBaseRevokeTokenKey({userId:payload.sub})})})
      break;
  
    default:
      await createRevokeToken({payload})
      break;
  }
  return
}



