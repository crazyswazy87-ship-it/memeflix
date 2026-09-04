import * as z from "zod"

 export const SignupValidation = z.object({
  name: z.string() .min(2, {message: 'Too short'}),
  username: z.string().min(2, {message: 'Username must be atleast more than 2 characters'}).max(25, {message: 'Try using a shorter username'}),
  email: z.string() .min(5, {message: 'Invalid email address'}),
  password: z.string() .min(6, {message: 'Password must be atleast 6 characters'}),
  })

  export const SigninValidation = z.object({
  email: z.string() .min(5, {message: 'Invalid email address'}),
  password: z.string() .min(6, {message: 'Password must be atleast 6 characters'}),
  })