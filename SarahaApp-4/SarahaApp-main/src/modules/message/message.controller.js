import {Router} from 'express';
import { successResponse } from '../../common/utlis/success.response.js';
const router = Router();

router.post("/" , async (req,res,next)=>{
return successResponse({res , status:201 , data })
})



export default router;

