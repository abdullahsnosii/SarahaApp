import {Router} from 'express';
import { successResponse } from '../../common/utlis/success.response.js';
import { confirm_2_step_verification, confirmationLogin, confirmEmail, enable_2_step_verification, login, requestForgotPasswordCode, resendConfirmEmail, resetForgotPassword, signup, signupWithGmail, verifyForgotPasswordCode } from './authentication.service.js';
import * as validators from './authentication.validation.js'
import { validation } from '../../middleware/validation.middleware.js';
const router = Router();

router.post("/signup" , validation(validators.signup), async(req,res,next)=>{

const data = await signup(req.body)
return successResponse({res , status:201 , data})
})


router.patch("/confirm-email" , validation(validators.confirmEmail), async(req,res,next)=>{

const data = await confirmEmail(req.body)
return successResponse({res , status:200 , data})
})


router.patch("/resend-confirm-email" , validation(validators.resendConfirmEmail), async(req,res,next)=>{

const data = await resendConfirmEmail(req.body)
return successResponse({res , status:200 , data})
})



router.post("/request-forgot-password-code" , validation(validators.requestForgotPasswordCode), async(req,res,next)=>{

const data = await requestForgotPasswordCode(req.body)
return successResponse({res , status:201 , data})
})

router.post("/verify-forgot-password" , validation(validators.confirmEmail), async(req,res,next)=>{

const data = await verifyForgotPasswordCode(req.body)
return successResponse({res , status:200 , data})
})


router.patch("/reset-forgot-password" , validation(validators.veriryForgotPassword), async(req,res,next)=>{

const data = await resetForgotPassword(req.body)
return successResponse({res , status:200 , data})
})


router.post("/signup-with-gmail" , async(req,res,next)=>{
 const {status , data} = await signupWithGmail(req.body , `${req.protocol}://${req.host}`)
return successResponse({res , status:status , data})
})


router.post("/enable-2-step-verification" , validation(validators.enable_2_step_verification), async(req,res,next)=>{
const data = await enable_2_step_verification(req.body)
return successResponse({res , status:201 , data})
})


router.post("/confirm-2-step-verification" , validation(validators.confirm_2_step_verification), async(req,res,next)=>{
const data = await confirm_2_step_verification(req.body)
return successResponse({res , status:201 , data})
})


router.post("/login" , validation(validators.login),async (req,res,next)=>{ 

const data = await login(req.validate.body , `${req.protocol}://${req.host}`)
return successResponse({res , data})

})


router.post("/Confirmation-Login" , validation(validators.Confirmation_Login),async (req,res,next)=>{ 

const data = await confirmationLogin(req.body , `${req.protocol}://${req.host}`)
return successResponse({res , data})

})


export default router;