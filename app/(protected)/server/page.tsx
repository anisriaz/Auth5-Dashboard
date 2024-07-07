import { currentUser } from "@/lib/auth"
import { UserInfo } from "@/components/userInfo";

const ServerPage = async () => {
    const user = await currentUser();


  return (
    <div>
      <UserInfo
      label="💻Server Component"
       user={user} 
       />
        </div>
  )
}

export default ServerPage