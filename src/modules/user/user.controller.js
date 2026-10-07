import {Router} from 'express';
import { successResponse } from '../../common/utlis/success.response.js';
import { logout, profile, rotateToken, update } from './user.service.js';
import { authentication, authorization } from '../../middleware/authentication.middleware.js';
import { tokenTypeEnum } from '../../common/enum/security.enum.js';
import { RoleEnum } from '../../common/enum/user.enum.js';
import { fileValidation, localFielupload } from '../../common/utlis/index.js';
import { uploadMiddleware } from '../../middleware/index.js';
const router = Router();

router.get("/" , authentication(),async (req,res,next)=>{
const data = await profile(req.user)
 return successResponse({res , data})
})


router.patch
("/profile-image" ,
      authentication() ,
       uploadMiddleware({multerMiddleware: localFielupload({maxFileSize : 2 }).single("attachment") , customPath :"users" , validation : fileValidation.image }) ,

         async (req,res,next)=>{
     req.user.image = req.file.finalPath
     await req.user.save()
     return successResponse({res , data:{user : req.user}})
})


router.patch("/" , authentication() , authorization(RoleEnum.ADMIN),async (req,res,next)=>{
const data = await update(req.user , req.body)
 return successResponse({res , data})
})


router.post("/rotate-token" , authentication(tokenTypeEnum.REFRESH),async (req,res,next)=>{
const data = await rotateToken(req.payload , req.user , `${req.protocol}://${req.host}`)
console.log(req.payload);

 return successResponse({res , data})
})




router.post("/logout" , authentication(),async (req,res,next)=>{
const data = await logout(req.payload , req.user, req.body)
console.log(req.payload);

 return successResponse({res , data})
})



export default router;
