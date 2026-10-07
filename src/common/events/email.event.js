import {EventEmitter} from 'node:events'
import { sendEmail } from '../utlis/email/index.js'
import { verifyEmailTemplate } from '../utlis/email/template/email.templates.js'

export const emailEvent = new EventEmitter()

emailEvent.on("send-Email" , async ({recipients , subject , data})=>{

     try {
         await sendEmail({
           ...recipients,
           subject,
           html: verifyEmailTemplate({code: data.code , subject , title: data.title ?? subject })
    
        })
     } catch (error) {
        console.log("Fail to send email");
        
     }
})