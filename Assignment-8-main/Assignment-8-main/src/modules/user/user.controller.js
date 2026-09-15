import {Router} from 'express';
import { successResponse } from '../../common/utlis/success.response.js';
import { deleteUser, getUserById, updateUser } from './user.service.js';
const router = Router();

router.patch("/:id" , async (req,res,next)=>{
 const data = await updateUser(req.body , req.params)   
 return successResponse({res , data})
})

router.delete("/" , async (req,res,next)=>{
 const data = await deleteUser(req.query)   
 return successResponse({res , data})
})

router.get("/" , async (req,res,next)=>{
 const data = await getUserById(req.query)   
 return successResponse({res , data})
})

export default router;
