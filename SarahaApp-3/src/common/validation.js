import {z} from "zod"
import { GenderEnum } from "./enum/user.enum.js"
import { LanguageEnum } from "./enum/security.enum.js"
import { error } from "node:console"


const validationMessages = {

    101: {
        ar: "البريد الإلكتروني غير صحيح",
        en: "Invalid email format"
    },

    102: {
        ar: "اسم المستخدم يجب أن يكون حرفين على الأقل",
        en: "Username must be at least 2 characters"
    },

    103: {
        ar: "اسم المستخدم يجب ألا يتجاوز 51 حرفًا",
        en: "Username must not exceed 51 characters"
    },

    104: {
        ar: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
        en: "Password must be at least 8 characters"
    },

    105: {
        ar: "كلمة المرور يجب ألا تتجاوز 16 حرفًا",
        en: "Password must not exceed 16 characters"
    },

    106: {
        ar: "رقم الهاتف غير صحيح",
        en: "Invalid phone number"
    },

    107: {
        ar: "النوع غير صحيح",
        en: "Invalid gender"
    },

    108: {
        ar: "اسم المستخدم يجب أن يتكون من جزئين",
        en: "Username must contain 2 parts"
    },

    109: {
        ar: "البيانات غير متطابقة",
        en: "Fields do not match"
    }
}


const getValidationMessages = (lang , code)=>{
return lang == LanguageEnum.AR ? validationMessages[code].ar : validationMessages[code].en
}

export const matchFields = ({
    original,
    copy,
    data,
    ctx,
    lang
}) => {

    if (data[original] !== data[copy]) {

        ctx.addIssue({
            code: "custom",
            path: [copy],
            message: getValidationMessages(lang, 109)
        })

    }

}


export const generalValidationFields = {

    email: (lang) =>
        z.email({
            message: getValidationMessages(lang, 101)
        }),


    password: (lang) =>
        z.string().regex(/^(?=.*[a-z])(?=.*\s{0,})(?=.*[A-Z])(?=.*\d)(?=.*[!@#%$_&*()]).{8,16}$/ )
            .min(8, {
                message: getValidationMessages(lang, 104)
            })
            .max(16, {
                message: getValidationMessages(lang, 105)
            }),


    username: (lang) =>
        z.string()
            .min(2, {
                message: getValidationMessages(lang, 102)
            })
            .max(51, {
                message: getValidationMessages(lang, 103)
            }),


    phone: (lang) =>
        z.e164({
            message: getValidationMessages(lang, 106)
        }),


    confirmPassword: (lang) =>
        z.string()
            .min(8, {
                message: getValidationMessages(lang, 104)
            })
            .max(16, {
                message: getValidationMessages(lang, 105)
            }),


    gender: (lang) =>
        z.enum(GenderEnum, {
            message: getValidationMessages(lang, 107)
        }),


    matchFields

}
