// import  SettingPage  from "@/app/(protected)/settings/page";
import { MainNav } from "@/app/(SiteNavbar)/mainNav";
import StoreSwitcher from "@/components/storeSwitcher";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth"; 
import {prismadb} from "@/lib/prismadb";
import { ThemeToggle } from "@/components/themeToggle";


const Navbar = async  () => {

    const user = await currentUser(); 
        const userId = user?.id; 
        
        if(!userId) {
            redirect("/sign-in")
        }

        const stores = await prismadb.store.findMany({
            where: {
                userId
            }
        })

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
               <StoreSwitcher items={stores}/>
                <MainNav className="mx-6"/>    
            <div className="ml-auto flex items-center space-x-4">
                <ThemeToggle />
                {/* <SettingPage afterSignOutUrl="/" /> */}
                </div>
            </div>
        </div>
    )
}

export default Navbar;