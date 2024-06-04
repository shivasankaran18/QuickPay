import { Button } from "./button";

interface AppbarProps {
    user?: {
        name?: string | null,
        email?:string | null
    },
   
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b px-4 border-slate-300">
        <div className="text-lg flex flex-col justify-center w-2/12" >
       
        <div className="flex justify-center  max-h-fit">
           
            QuickPay
        </div>
        </div>
        
        
        <div className="flex flex-col justify-center pt-2">
          <div className="flex gap-4">
            
            <Avatar name={user?.email||""}   />
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
          </div>
           
        </div>
    </div>
}





function Avatar({ name, size = "big" }: { name: string, size?: "small" | "big" }) {
   
    return <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
    <span className={`${size === "small" ? "text-xs" : "text-md"} font-extralight text-gray-600 dark:text-gray-300`}>
        {name[0]?.toUpperCase()}
    </span>
</div>
}



