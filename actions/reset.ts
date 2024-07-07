"use server"
import * as z from "zod"

import { ResetSchema } from "@/Schemas"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { genratePasswordResetToken } from "@/lib/tokens"


export const reset = async (values: z.infer<typeof ResetSchema>) => {
const validateFields = ResetSchema.safeParse(values)

if(!validateFields.success) {
    return { error: "invalid email" };
}
const { email } = validateFields.data;

const esixtingUser = await getUserByEmail(email);

if (!esixtingUser) {
    return {error: "Email not found"};
}

//TODO Genrate token  & send email

const passwordResetToken = await genratePasswordResetToken(email);
console.log(passwordResetToken);
await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
)


return {success: "Reset Email Sent"};
}