import {z} from 'zod'



export const registerSchema = z.object({
    userEmail:z.string().email("Email incorrect"),
    userName : z.string().min(3,"Name contain atleast 3 character"),
    password: z.string().min(3,"password contain atleast 3 character"),
    role : z.string().min(3,"Please select a role"),
})


export const loginSchema = z.object({
    userEmail:z.string().email("Email incorrect"),
    password: z.string().min(3,"password contain atleast 3 character"),
})