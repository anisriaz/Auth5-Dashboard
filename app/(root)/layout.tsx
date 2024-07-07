import { currentUser } from "@/lib/auth";
import {prismadb} from "@/lib/prismadb";
import { redirect } from "next/navigation" 


export default async function SetupLayout({
children
}: {
    children: React.ReactNode
}) {
    const user = await currentUser(); 
    const userId = user?.id; 

    if(!userId) {
        redirect("/sign-in");
    }


    const store = await prismadb.store.findFirst({
        where: {
          userId,
        }
      });

    if(store) {
        redirect(`/${store.id}`)
    }

    return (
        <>
        {children}
        </>
    )
}
