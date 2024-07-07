"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { UserInfo } from "@/components/userInfo";

const ClientPage =  () => {
    const user = useCurrentUser();


  return (
    <div>
      <UserInfo
      label="Client Component"
       user={user} 
       />
        </div>
  )
}

export default ClientPage