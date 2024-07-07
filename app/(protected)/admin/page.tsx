"use client"

import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/roleGate";
import { FormSuccess } from "@/components/formSuccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner"


const AdminPage =  () => {
 const onServerActionClick = () => {
  admin()
  .then((data) => {
  if (data.error) {
    toast.error(data.error)
  }

  if(data.success) {
    toast.success(data.success);
  }
  })
 }


  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) =>{
      if(response.ok) {
       toast.success("Allow Api Route");
      } else {
        toast.error("Forbidden Api Route")
      }
    })
  }


  return (
    <div>
      <Card className="w-[600px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            Admin
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
         <RoleGate allowedRole={UserRole.ADMIN}>
           <FormSuccess 
          message="You are allow to see this content"
           />
         </RoleGate>
         <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p  className="text-sm font-medium">
            ADMIN-only API Route
          </p>
          <Button onClick={onApiRouteClick}>
            Click to test
          </Button>
         </div>

         <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p  className="text-sm font-medium">
            ADMIN-only Server Action
          </p>
          <Button onClick={onServerActionClick}>
            Click to test
          </Button>
         </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPage;







//Server Component

// import { CurrenttRole } from "@/lib/auth";


// const AdminPage = async () => {
//  const role = await CurrenttRole();

//   return (
//     <div>
//       Current role: {role}
//     </div>
//   )
// }

// export default AdminPage;