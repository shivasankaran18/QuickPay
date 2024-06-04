import prisma from "@repo/db/client";
import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/lib/auth";

export async function getBalance() {
    const session = await getServerSession(authOptions);
  const balance = await prisma.merchant.findFirst({
    where: {
      id: Number(session?.user?.id)
    }
  });
  return {
    amount: balance?.mer_amount || 0,
  };
}

export async function getOffRamped(){
    const session=await getServerSession(authOptions)
    const offramped=await prisma.offRamp.findMany({
        where:{
            merchname:session.user.name,
        },
        select:{
            amount:true
        }
    })
    let sum=0
    for(let i=0;i<offramped.length;i++)
    {
        sum+=offramped[i]?.amount ||0
    }    
    return sum;
}

export const BalanceCard = async () => {
    const {amount}=await getBalance();
    const offRamped=await getOffRamped();

    return <Card title={"Balance"}>
        <div className="flex justify-between border-b border-slate-300 pb-2">
            <div>
                Amount in the Wallet
            </div>
            <div>
                {amount / 100} INR
            </div>
        </div>
        <div className="flex justify-between border-b border-slate-300 py-2">
            <div>
                Total OffRamped Amount
            </div>
            <div>
                {offRamped / 100} INR
            </div>
        </div>
        <div className="flex justify-between border-b border-slate-300 py-2">
            <div>
                Total Received
            </div>
            <div>
                {(offRamped + amount) / 100} INR
            </div>
        </div>
    </Card>
}