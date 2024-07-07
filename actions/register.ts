"use server"

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db"
import { RegisterSchema } from "@/Schemas"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail"

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "invalid fields" }
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail (email);

    if (existingUser) {
        return { error: "Email already in use"};
    }
    await db.user.create({
        data: {
           name,
           email,
           password: hashedPassword,
        }
    }) ;
    const VerificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
    VerificationToken.email,
    VerificationToken.token,
    );

    return { success: "confirmation emal sent!" }
}
