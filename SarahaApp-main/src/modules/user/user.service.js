import jwt from 'jsonwebtoken'
import { findByIdAndUpdate } from '../../common/repository/base.repository.js';
import { UserModel } from '../../DB/model/user.model.js';
import { createLoginCredentials, createToken, verifyToken } from '../../common/security/token.security.js';
import { decryption } from '../../common/security/encryption.security.js';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN} from '../../config.js';
import { ConflictException } from '../../common/exceptions/error.exception.js';

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
const currentTime = Date.now()+ (300 * 60000)

if(currentTime < accessExpiresIn )
{
 throw ConflictException("sorry we cannot create new login credintials while current access token still within valid time range")
}

return await createLoginCredentials({user , issuer})

}


