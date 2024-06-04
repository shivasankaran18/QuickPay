"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import prisma from "@repo/db/client"
import { json } from "stream/consumers"


export async function offRamp(amt:number,receiver:string){
    const session=await getServerSession(authOptions)
    console.log(session)
    const merch=await prisma.merchant.findUnique({
        where:{
                id:Number(session.user.id)
        }
    })

    if((merch?.mer_amount||0)<amt)
    {
        throw new Error("insuff balance")
    }    
    

    await prisma.$transaction(async (tx)=>{

        await tx.merchant.update({
            where:{
                id:Number(session.user.id)
            },
            data:{
                mer_amount:{
                    decrement:amt
                }
            }
        })


        const res=await tx.offRamp.create({
            data:{
                receiver,
                merchname:session.user.name,
                timestamp:new Date(),
                amount:amt
            }
        })


    }
    )

   return JSON.stringify({msg:"done"})

}