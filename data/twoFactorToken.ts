import { db } from "@/lib/db";


export const getTwoFAactorTokenByToken = async (token: string) => {
    try {
      const getTwoFAactorToken = await db.twoFactorToken.findUnique({
        where: { token }
      });
      return getTwoFAactorToken;
    } catch {
        return null;
    }
}


export const getTwoFAactorTokenByEmail = async (email: string) => {
    try {
      const getTwoFAactorToken = await db.twoFactorToken.findFirst({
        where: { email }
      });
      return getTwoFAactorToken;
    } catch {
        return null;
    }
}