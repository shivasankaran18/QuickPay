import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import { OnRampTransactions } from "../../../components/History"

async function getOffRampTransactions() {
    const session = await getServerSession(authOptions)
    const txns = await prisma.offRamp.findMany({
      where: {
        merchname:(session?.user?.name),
      },
    })
    const arr= txns.map((t) => ({
      time: t.timestamp,
      amount: t.amount,
      status: "Sent",
      provider: t.receiver,
    }))
    console.log(arr);
    return arr.reverse();
  }
  
 
  async function getMerchantTransaction(){
    const session=await getServerSession(authOptions)
    const txns=await prisma.merchTransaction.findMany({
      where:{
        merchantName:session.user.name
      }
    })

    const users=await prisma.user.findMany()

    function fn(userId:number)
    {
        for(let i=0;i<users.length;i++){

            if((users[i]?.id || 0)==userId){
                return users[i]?.name
            }
        }
    }
    //@ts-ignore
    const arr=txns.map( (t)=>({
      time:t.timestamp,
      amount:t.amount,
      status:"Received",
      provider: fn(t.userId) ||""


    }))
    return arr.reverse()
  }
  
  export default async function () {
    const offRampedtransaction=await getOffRampTransactions();
    const merchantTransactions =await getMerchantTransaction()
  
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
          Transactions
        </h1>
  
        <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 px-10 gap-3">
          <h1 className="text-2xl text-[#6a51a6] pt-2 font-bold col-span-2">
            Received Transactions
          </h1>
          <div>
            <OnRampTransactions
              title={"Received transactions"}
              transactions={merchantTransactions }
            />
          </div>
         
        </div>
        <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 px-10 gap-3">
          <h1 className="text-2xl text-[#6a51a6] pt-2 font-bold col-span-2">
              OffRamped Transactions
          </h1>
          <div>
            <OnRampTransactions
              title={"OffRamped Transactions"}
              transactions={offRampedtransaction}
            />
          </div>




        </div>
  
     
      </div>
    )
  }