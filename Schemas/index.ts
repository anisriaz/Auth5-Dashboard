import { UserRole } from "@prisma/client";
import * as z from "zod";



//Login Schema
export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    code: z.optional(z.string()),
});



//Register Schema
export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum 5 characters required"
    }),
    name: z.string().min(1, {
         message: "Name is required"
    })
});



//Reset passwordSchema
export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

  


//Forgot password
export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of six characters required"
    }),
});


//Setting Page Schema


export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
    .refine((data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
  
      return true;
    }, {
      message: "New password is required!",
      path: ["newPassword"]
    })
    .refine((data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
  
      return true;
    }, {
      message: "Password is required!",
      path: ["password"]
    })
  