import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD } from "../../../config.js";
import { BadException } from "../../exceptions/error.exception.js";


export const userEmailKey = ({email , subject})=>{
  return `User::${email}::${subject}::OTP`
}



export const userEmaiTrialsKey = ({email , subject})=>{
  return `${userEmailKey({email , subject})}::Trials`
}


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});


export async function sendEmail({
     to, 
     cc,
     bcc,
    subject,
    text,
    html,
    attachments=[], 
}) {
    try {

        if (!to?.length && !cc?.length && !bcc?.length) {
            throw BadException("invalid recipient")
        } 

          if (!html?.length && !text?.length && !attachments?.length) {
            throw BadException("invalid email content")
        } 

  const info = await transporter.sendMail({
    from: `"Route Academy" <${APP_EMAIL}>`, // sender address
    to, // list of recipients
    cc, 
    bcc,
    subject, // subject line
    text, // plain text body
    html,
    attachments:[], // HTML body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
}