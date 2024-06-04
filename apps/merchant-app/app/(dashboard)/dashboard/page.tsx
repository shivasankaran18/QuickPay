import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import { BalanceCard } from "../../../components/BalanceCard"
import { Image } from "../../../components/Image"



export default async function Home()
{
    const session=await getServerSession(authOptions)
    return(
        <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
          Hi {session.user.name}
        </div>

        <div className="flex flex-col justify-center">
      <div className="flex justify-center ">
        <Image />
      </div>
    </div>

        <div className="flex flex-col space-between w-full h-5/6">
        <div className="grid grid-cols-1 bg-red-800 m-12 ">
            <BalanceCard  />
            
          </div>
        </div>
    
      </div>
    )
}