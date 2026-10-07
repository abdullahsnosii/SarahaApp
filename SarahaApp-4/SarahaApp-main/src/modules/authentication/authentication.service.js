import { createOne, findOne } from "../../common/repository/base.repository.js"
import { UserModel } from "../../DB/model/user.model.js"
import { BadException, ConflictException, NotfoundException, TooManyRequestException } from "../../common/exceptions/error.exception.js"
import { compare, hash } from "../../common/security/hash.security.js"
import { encryption } from "../../common/security/encryption.security.js"
import { createLoginCredentials, userBaseRevokeTokenKey } from "../../common/security/token.security.js"
import { WEB_CLIENT_IDS } from "../../config.js"


 import {OAuth2Client} from 'google-auth-library';
import { ProviderEnum } from "../../common/enum/user.enum.js"
import { emailEvent } from "../../common/events/email.event.js"
import { EmailSubjectEnum } from "../../common/enum/email.enum.js"
import { createOtp, loginTrialsKey, userEmailKey, userEmaiTrialsKey } from "../../common/utlis/index.js"
import { del, expire, get, incrBy, keys, set, ttl } from "../../common/services/cache.service.js"


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



    const sendEmailOtp = async({email , subject , title , expiresIn = 120 , maxTrials = 3 , blockInSeconds = 300})=>{

    const existOTP_TTL = await ttl({key : userEmailKey({email , subject})})
    if (existOTP_TTL > 0) {
        throw ConflictException(`sorry we connot create new otp while existing one still valid please try again later after ${existOTP_TTL}`)
    }

    const oldTrials = await get({key: userEmaiTrialsKey({email , subject})}) ?? 0;

    if (oldTrials >= maxTrials) {
        throw TooManyRequestException("Max otp trials has been reached")
    }

    const code = createOtp()
    await set({
        key: userEmailKey({email , subject}),
        value:await hash(code.toString()),
        ttl : expiresIn
    })  

    const currentTrials = await incrBy({key:userEmaiTrialsKey({email , subject})} )
    if (currentTrials == 3) {
        await expire({key:userEmaiTrialsKey({email , subject}) , ttl : blockInSeconds})
    }

    emailEvent.emit("send-Email" ,
         {
            recipients:{to:email} ,
             subject ,
              data:{code , title : title ?? subject}})

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

await sendEmailOtp({email , subject : EmailSubjectEnum.CONFIRM_EMAIL})
return account
}



export const resendConfirmEmail = async ({email})=>{

const account = await findOne({
    model:UserModel ,
     filter:{email , provider:ProviderEnum.SYSTEM , confirmEmail: {$exists:false}} ,
      options:{select:"email"}
    })

if(!account) throw NotfoundException("Invalid acccount")

await sendEmailOtp({email , subject : EmailSubjectEnum.CONFIRM_EMAIL})
return

}

 

export const confirmEmail = async ({email , otp})=>{

const account = await findOne({
    model:UserModel ,
     filter:{email , provider:ProviderEnum.SYSTEM , confirmEmail: {$exists:false}} ,
      options:{select:"email"}
    })

if(!account) throw NotfoundException("Invalid acccount")

const hashOtp = await get({key : userEmailKey({email , subject: EmailSubjectEnum.CONFIRM_EMAIL})})

if(!hashOtp || !(await compare(otp , hashOtp))){

     throw ConflictException("Invalid OTP")
}

account.confirmEmail = new Date();
await account.save()

await del({key: await keys({prefix : userEmailKey({email , subject: EmailSubjectEnum.CONFIRM_EMAIL})})})

return

}



export const requestForgotPasswordCode = async ({email})=>{

const account = await findOne({
    model:UserModel ,
     filter:{email , provider:ProviderEnum.SYSTEM , confirmEmail: {$exists:true}} ,
      options:{select:"email"}
    })

if(!account) throw NotfoundException("Invalid acccount")

await sendEmailOtp({email , subject : EmailSubjectEnum.FORGOT_PASSWORD})
return

}



export const verifyForgotPasswordCode = async ({email , otp})=>{

const account = await findOne({
    model:UserModel ,
     filter:{email , provider:ProviderEnum.SYSTEM , confirmEmail: {$exists:true}} ,
      options:{select:"email"}
    })

if(!account) throw NotfoundException("Invalid acccount")

const hashOtp = await get({key : userEmailKey({email , subject: EmailSubjectEnum.FORGOT_PASSWORD})})

if(!hashOtp || !(await compare(otp , hashOtp))){

     throw ConflictException("Invalid OTP")
}

return account

}




export const resetForgotPassword = async ({email , otp , password })=>{

const account = await verifyForgotPasswordCode({email , otp})
account.password = await hash(password)
account.changeCredentialsTime = new Date()
await account.save()

const result = await Promise.all([
     keys({prefix : userEmailKey({email , subject: EmailSubjectEnum.FORGOT_PASSWORD})}),
     keys({prefix: userBaseRevokeTokenKey({userId:account._id})})
])

await del({
    key: [...result[0] , ...result[1]]
})



}



export const enable_2_step_verification = async ({email})=>{

const account = await findOne({
    model:UserModel ,
     filter:{email , provider:ProviderEnum.SYSTEM , confirmEmail: {$exists:true}} ,
      options:{select:"email"}
    })

if(!account) throw NotfoundException("Invalid acccount")

await sendEmailOtp({email , subject : EmailSubjectEnum.TWO_STEP_VERIFICATION})
return

}




export const confirm_2_step_verification = async ({email , otp})=>{

const account = await findOne({
    model:UserModel ,
     filter:{email , provider:ProviderEnum.SYSTEM , twoStepVerification: {$exists:false}} ,
      options:{select:"email"}
    })

if(!account) throw NotfoundException("Invalid acccount")

const hashOtp = await get({key : userEmailKey({email , subject: EmailSubjectEnum.TWO_STEP_VERIFICATION})})

if(!hashOtp || !(await compare(otp , hashOtp))){

     throw ConflictException("Invalid OTP")
}

account.twoStepVerification = new Date();
await account.save()

await del({key: await keys({prefix : userEmailKey({email , subject: EmailSubjectEnum.TWO_STEP_VERIFICATION})})})

return

}


export const login = async ({email , password } , issuer ,  maxTrials = 5 , blockInSeconds = 300)=>{

const oldTrials = await get({key: loginTrialsKey({email})}) ?? 0;
     if (oldTrials >= maxTrials) {
        throw TooManyRequestException(`your account is temporarily blocked please try again after ${await ttl({key : loginTrialsKey({email})})} seconds`)
     }


const account = await findOne({
    model:UserModel , 
    filter:{email , provider:ProviderEnum.SYSTEM , confirmEmail:{$exists: true}} 
})
if(!account) throw  NotfoundException("not Exist")
const matchPassword = await compare(password , account.password)

if(!matchPassword){

 const currentTrials = await incrBy({key: loginTrialsKey({email})} )
 if (currentTrials == 5) {
          await expire({key:loginTrialsKey({email}) , ttl : blockInSeconds})    
          throw TooManyRequestException("Too many falile login attempts. your account is temporarily blocked for 5 minutes")
    }
  throw NotfoundException("Invalid password")
}

await del({key: loginTrialsKey({email})})

if(account.twoStepVerification){

await sendEmailOtp({email , subject : EmailSubjectEnum.LOGIN})
 throw BadException("Two step verification required")
}

return await createLoginCredentials({user:account , issuer})

}





export const confirmationLogin = async ({email , otp} , issuer)=>{

const account = await findOne({
    model:UserModel ,
     filter:{email , provider:ProviderEnum.SYSTEM , confirmEmail: {$exists:true}} ,
      options:{select:"email"}
    })

if(!account) throw NotfoundException("Invalid acccount")

const hashOtp = await get({key : userEmailKey({email , subject: EmailSubjectEnum.LOGIN})})

if(!hashOtp || !(await compare(otp , hashOtp))){

     throw ConflictException("Invalid OTP")
}

await del({key: await keys({prefix : userEmailKey({email , subject: EmailSubjectEnum.LOGIN})})})

 return await createLoginCredentials({user:account , issuer})


}