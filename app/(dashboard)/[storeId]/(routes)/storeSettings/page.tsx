
import { currentUser } from "@/lib/auth"; 
import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import { StoreSettingsForm } from "./componentes/storeSettingsForm";



interface StoreSettingsPageProps {
  params: {
    storeId: string;
  }
}

const StoreSettings: React.FC<StoreSettingsPageProps> = async ({
  params
}) => {

  const user = await currentUser(); 
  const userId = user?.id; 

  if(!userId) {
    redirect("/sign-in")
  }

  const store = await prismadb.store.findFirst({
  where: {
    id: params.storeId,
    userId
  }
  });

  if(!store) {
    redirect("/")
  }
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <StoreSettingsForm initialData={store} />
      </div>
      </div>
  )
}

export default StoreSettings
