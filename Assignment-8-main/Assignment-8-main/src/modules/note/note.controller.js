import {Router} from 'express';
import { successResponse } from '../../common/utlis/success.response.js';
import { creteSingleNote, delete_All_Notes, deleteNote, get_note_by_content, get_note_by_id, get_note_with_user, get_note_with_user_by_title, paginate_note, replaceNote, update_titlte_all_notes, updateNote } from './note.service.js';
const router = Router();

//Q1
router.post("/" , async (req,res,next)=>{
const data = await creteSingleNote(req.body , req.query)
return successResponse({res , message:"Note created" ,status:201 , data })
})

// Q2  
router.patch("/ID/:noteId" , async (req,res,next)=>{
const data = await updateNote(req.body , req.params , req.query)
return successResponse({res  ,status:200 , data })
})

//Q3
router.put("/:noteId" , async (req,res,next)=>{
const data = await replaceNote(req.body , req.params , req.query)
return successResponse({res  ,status:200 , data })
})

// Q5
router.patch("/all" , async (req,res,next)=>{
const data = await update_titlte_all_notes(req.body , req.query)
if(data.matchedCount === 0 ) return successResponse({res  ,message:"No note found",status:404 , data })

return successResponse({res  ,message:"All notes updated",status:200 , data })

})


 
// Q6
router.delete("/:noteId" , async (req,res,next)=>{
const data = await deleteNote( req.params , req.query)
return successResponse({res  ,status:200 , data })
})

// Q7
router.get("/paginate-sort" , async (req,res,next)=>{
const data = await paginate_note(req.query)
return successResponse({res  ,status:200 , data })
})

// Q8
router.get("/ID/:id" , async (req,res,next)=>{
const data = await get_note_by_id(req.params , req.query)
return successResponse({res  ,status:200 , data })
})

// Q9
router.get("/note-by-content" , async (req,res,next)=>{
const data = await get_note_by_content( req.query)
return successResponse({res  ,status:200 , data })
})

// Q10
router.get("/note-with-user" , async (req,res,next)=>{
const data = await get_note_with_user ( req.query)
return successResponse({res  ,status:200 , data })
})

// Q11
router.get("/aggregate" , async (req,res,next)=>{
const data = await get_note_with_user_by_title ( req.query)
return successResponse({res  ,status:200 , data })
})

// Q12
router.delete("/" , async (req,res,next)=>{
const data = await delete_All_Notes ( req.query)
return successResponse({res  ,status:200 , data })
})

export default router;

