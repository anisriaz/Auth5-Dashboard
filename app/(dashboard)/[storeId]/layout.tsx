import { currentUser } from "@/lib/auth";
import { prismadb } from "@/lib/prismadb";

import { redirect } from "next/navigation" 
import  Navbar  from "@/app/(SiteNavbar)/navbar";


export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const user = await currentUser(); 
    const userId = user?.id; 

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({ 
    where: {
      id: params.storeId,
      userId,
    }
   });

  if (!store) {
    redirect('/');
  };

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};