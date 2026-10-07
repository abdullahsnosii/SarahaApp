import multer  from "multer";
import {randomUUID} from 'node:crypto'
import { resolve } from "node:path";
import {mkdir, unlink, writeFile} from 'node:fs/promises'
import {fileTypeFromBuffer} from 'file-type'
import { BadException } from "../../exceptions/error.exception.js";
import { error } from "node:console";

export const fileValidation = {
    image:['image/jpeg' , 'image/png' , 'image/gif'],
    file:['application/pdf' , 'application/json']

}



export const localFielupload = ({maxFileSize = 5 }={})=>{
  
    const storage = multer.memoryStorage()
    return multer({storage , limits:{fileSize: maxFileSize * 1024 * 1024}})
}




export const proccessFile = async ({customPath = "general" , file , validation = []})=>{
       
        const result = await fileTypeFromBuffer(file.buffer)

        if(!result || !validation.includes(result.mime)) {
           throw BadException("Invalid file formats")            
        }else{

            await mkdir(resolve(`./assets/${customPath}`) , {recursive : true})
           const uniqueFilepath = `assets/${customPath}/${randomUUID()}.${result.ext}`
           await writeFile(resolve(`./${uniqueFilepath}` , file.buffer))

           file.finalPath = uniqueFilepath
           return file
        }


    }


export const proccessFiles = async ({customPath , files = [] , validation = []})=>{  
 
   const assets = []
   try {

    for (const file of files) {
    const uploadFile = await proccessFile({customPath , file , validation})
    assets.push(uploadFile)
  }  
  return assets

   } catch (error) {

    for (const file of files) {
      if (file.finalPath) {
        await unlink(resolve(`./${file.finalPath}`))
      }
   }
   throw error
 }}

 

 
export const proccessFields = async ({customPath , fields = {} , validation = []})=>{  
 
   const assets = []

   try {

    for (const field of Object.keys(fields)) {
    const files = await proccessFiles({customPath , files : fields[field] , validation})
    assets.push({field , files})
  }  
  return assets

   } catch (error) {
      for (const {files} of assets) {
        for (const file of files) {
             if (file.finalPath) {
              await unlink(resolve(`./${file.finalPath}`))
            }
   }
   }
   throw error
   }

  
 }



export const proccessMulterUpload = async ({req , customPath = "general", validation = []})=>{

       if (req.file) {
         await proccessFile({customPath , file : req.file , validation})
       }
        else if (Array.isArray(req.files)) {
         await proccessFiles({customPath , files : req.files , validation})
       }
       else if(typeof req.files =="object" && Object.keys(req.files)?.length){
         await proccessFields({customPath , fields : req.files , validation})

       }
    }































































// export const proccessFile = ({validation = []})=>{
//     return async (req , res , next)=>{
//         const filepath = resolve(`./${file.path}`)
//         console.log({f:file , filepath});
//         const fileBuffer = await readFile(filepath)
//         console.log({fileBuffer});
//         const result = await fileTypeFromBuffer(fileBuffer)
//         console.log({result});
        

//         if(!result || !validation.includes(result.mime)) {
//             await unlink(filepath)
//             next(new Error("Invalid file formats" , {cause:{status:400}} ))
//         }

//         next()

//     }
// }