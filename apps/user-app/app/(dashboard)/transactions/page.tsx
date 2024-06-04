import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import { OnRampTransactions } from "../../../components/History"



async function getOnRampTransactions(status: any) {
    const session = await getServerSession(authOptions)
    const txns = await prisma.onRampTransaction.findMany({
      where: {
        userId: Number(session?.user?.id),
        status: status,
      },
    })
    const arr= txns.map((t) => ({
      time: t.startTime,
      amount: t.amount,
      status: t.status,
      provider: t.provider,
    }))
  
    return arr.reverse();
  }
  
  async function getsentP2PTransactions() {
    const session = await getServerSession(authOptions)
    const txns = await prisma.p2P.findMany({
      where: {
        fromUserId: Number(session?.user?.id),
      },
    })

    const res=await prisma.user.findMany({select:{name:true,id:true}})

     function fn(toUserId:number){
      for(let i=0;i<res.length;i++){
        if(res[i]?.id==toUserId)
        {
            return res[i]?.name
        }
      }

    }
  
    const arr= txns.map((t) => ({
      time: t.timestamp,
      amount: t.amount,
      status: "Sent",
      provider:fn(t.toUserId) || "",
    }))

    return arr.reverse();
  }
  
  async function getreceiveP2PTransactions() {
    const session = await getServerSession(authOptions)
    const txns = await prisma.p2P.findMany({
      where: {
        toUserId: Number(session?.user?.id),
      },
    })

    const res=await prisma.user.findMany({select:{name:true,id:true}})

     function fn(fromUserId:number){
      for(let i=0;i<res.length;i++){
        if(res[i]?.id==fromUserId)
        {
            return res[i]?.name
        }
      }

    }
  
    const arr=txns.map((t) => ({
      time: t.timestamp,
      amount: t.amount,
      status: "Received",
      provider: fn(t.fromUserId) || "",
    }))
    return arr.reverse();
  }

  async function getMerchantTransaction(){
    const session=await getServerSession(authOptions)
    const txns=await prisma.merchTransaction.findMany({
      where:{
        userId:Number(session?.user?.id)
      }
    })

    const arr=txns.map((t)=>({
      time:t.timestamp,
      amount:t.amount,
      status:"Sent",
      provider:t.merchantName


    }))
    return arr.reverse()
  }
  
  export default async function () {
    const successTransactions = await getOnRampTransactions("Success")
    const processingTransactions = await getOnRampTransactions("Processing")
    const failureTransactions = await getOnRampTransactions("Failure")
    const sentTransactions: any = await getsentP2PTransactions()
    const receivedTransactions: any = await getreceiveP2PTransactions()
    const merchantTransactions =await getMerchantTransaction()
  
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
          Transactions
        </h1>
  
        <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 px-10 gap-3">
          <h1 className="text-2xl text-[#6a51a6] pt-2 font-bold col-span-2">
            P2P Transactions
          </h1>
          <div>
            <OnRampTransactions
              title={"Sent transactions"}
              transactions={sentTransactions}
            />
          </div>
          <div>
            <OnRampTransactions
              title={"Received transactions"}
              transactions={receivedTransactions}
            />
          </div>
        </div>
        <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 px-10 gap-3">
          <h1 className="text-2xl text-[#6a51a6] pt-2 font-bold col-span-2">
              Merchant Transactions
          </h1>
          <div>
            <OnRampTransactions
              title={"Merchant transactions"}
              transactions={merchantTransactions}
            />
          </div>




        </div>
  
        <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 px-10 gap-3">
          <h1 className="text-2xl text-[#6a51a6] pt-2 font-bold col-span-2">
            Wallet Transactions
          </h1>
          <div>
            <OnRampTransactions
              title={"Successfull transactions"}
              transactions={successTransactions}
            />
          </div>
  
          <div>
            <OnRampTransactions
              title={"Processing Transactions"}
              transactions={processingTransactions}
            />
          </div>
  
          <div>
            <OnRampTransactions
              title={"Failure Transactions"}
              transactions={failureTransactions}
            />
          </div>
        </div>
      </div>
    )
  }