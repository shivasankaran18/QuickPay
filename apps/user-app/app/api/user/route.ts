import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import { DevBundlerService } from "next/dist/server/lib/dev-bundler-service";
import prisma from "@repo/db/client";

export function GET(){
    return NextResponse.json({
        msg:"done"
    })
}

export const POST = async (req:NextRequest) => {
    const body=await req.json();
    const session=await getServerSession(authOptions);
    const userId=Number(session.user.id)


    await prisma.$transaction(async (tx)=>{
        const token=(Math.random()*100000).toString();

        await prisma.balance.update({
            where:{
                userId,
            },
            data:{
                amount:{
                    increment:body.amount
                }
            }
        })

        const res=await prisma.onRampTransaction.create({
            data:{
            token,
            userId,
            provider:body.provider,
            amount:Number(body.amount),
            startTime:new Date(),
            status:"Success"
         }
        })

   

    })
    return NextResponse.json({
        msg:"done"
    })
    

    
    
   
   
}


export async function PUT(){

    await prisma.user.update({
        where:{
            id:2
        },
        data:{
            name:"John"
        }
    })

    return NextResponse.json({
        msg:"done"
    })

}