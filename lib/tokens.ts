import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db"
import { getVerificationTokenByEmail } from "@/data/verificiationToken";
import { getPasswordResetTokenByEmail } from "@/data/passwordResetToken";
import { getTwoFAactorTokenByEmail } from "@/data/twoFactorToken";




//Genrate Two Factor Token
export const generateTwoFactorToken =async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();


    const expires = new Date (new Date().getTime()  + 5 * 60 * 1000);

    const existingToken = await getTwoFAactorTokenByEmail(email);

    if(existingToken){
        await db.twoFactorToken.delete({
            where: {
               id: existingToken.id, 
            }
        })
    }
    const twoFactorToken= await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return twoFactorToken;
}


//Genrate Password Reset Token
export const genratePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);


    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id }
        });
    }
    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken;
}




//Genrate Verification Token
export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });


    return verificationToken;
}