import { createOne, deleteMany, deleteOne, find, findById, findOne, paginate, updateMany, updateOne } from "../../common/repository/db.repository.js"
import { toObjectId } from "../../common/utlis/ObjectId.js"
import { NoteModel } from "../../DB/model/note.model.js"
import { UserModel } from "../../DB/model/user.model.js"

export const creteSingleNote = async ({title , content} , {userId})=>{
const Note = await createOne({model:NoteModel, data:{title , content , userId} , options:{validateBeforeSave : true}})
return Note
}

export const updateNote = async ({title ,content} , {noteId} , {userId})=>{
   
const docNote = await findById({ id:noteId , model:NoteModel })
if(!docNote)  throw new Error("Note not found" ,{cause:{status:404}})
 
if(docNote.userId.toString() != userId.toString())  throw new Error("You are not the owner" ,{cause:{status:403}})

const note = await updateOne({model:NoteModel , filter:{_id:noteId} , update:{$set:{title , content }}}) 
return note
}

export const replaceNote = async ({title ,content} , {noteId} , {userId})=>{
   
const docNote = await findById({ id:noteId , model:NoteModel })
if(!docNote)  throw new Error("Note not found" ,{cause:{status:404}})
 
if(docNote.userId.toString() != userId.toString())  throw new Error("You are not the owner" ,{cause:{status:403}})

const note = await NoteModel.findOneAndReplace({_id:noteId},{title , content , userId} , {returnDocument:"after"}) 
return note
}

export const update_titlte_all_notes = async ({title} , {userId})=>{
   
const note = await updateMany({model:NoteModel , filter:{userId:toObjectId(userId)} , update:{$set:{title}}}) 
return note    

}

export const deleteNote = async ( {noteId} , {userId})=>{
   
const docNote = await findById({ id:noteId , model:NoteModel })
if(!docNote)  throw new Error("Note not found" ,{cause:{status:404}})
 
if(docNote.userId.toString() != userId.toString())  throw new Error("You are not the owner" ,{cause:{status:403}})

const note = await deleteOne({model:NoteModel , filter:{_id:noteId} }) 
return note
}

export const paginate_note = async ( {page , limit , userId})=>{
   
const note = await paginate({model:NoteModel , filter:{userId} , page , size:limit , options:{sort:{createdAt:-1}}  }) 
return note
}

export const get_note_by_id = async ( {id} , {userId})=>{
  
const docNote = await findById({ id:id , model:NoteModel })
if(!docNote)  throw new Error("Note not found" ,{cause:{status:404}})
 
if(docNote.userId.toString() != userId.toString())  throw new Error("You are not the owner" ,{cause:{status:403}})

return docNote   

}

export const get_note_by_content = async ( {content , userId})=>{
  
const docNote = await findOne({ filter:{content} , model:NoteModel })
if(!docNote)  throw new Error("Note not found" ,{cause:{status:404}})
 
if(docNote.userId.toString() != userId.toString())  throw new Error("You are not the owner" ,{cause:{status:403}})

return docNote   

}

export const get_note_with_user = async ( {userId})=>{
  
const docNote = await find({ filter:{userId} , model:NoteModel , options:{populate:{path:"userId" , select:"email -_id"}} , select:"title , createdAt"})
return docNote   

}

export const get_note_with_user_by_title = async ( {title})=>{
  
const docNote = await NoteModel.aggregate([
   {
     $match:{
    title:title
    }
},
    {
        $lookup:{
        from:"users",
        localField:"userId",
        foreignField:"_id",
        as:"owner"
    }
}
])
return docNote   

}

export const delete_All_Notes = async ({userId})=>{

const note = await deleteMany({model:NoteModel , filter:{userId} }) 
return note
}