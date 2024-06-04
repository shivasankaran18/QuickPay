import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/db/client";


export async function POST(req:NextRequest){
    const session=await getServerSession(authOptions);
    const fromUser=session?.user.id
    console.log(fromUser)

    const body=await req.json();
    if(!fromUser)
    {
        return NextResponse.json({
            msg:"error"
        })
        
    }
    const toUser=await prisma.user.findFirst({
        where:{
            email:body.to
            
        }
    })
    if(!toUser)
    {
        return NextResponse.json({
            msg:"invalid user"
    })
    }    

    await prisma.$transaction(async(tx)=>{
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromUser)} FOR UPDATE`;

        const fromBalance =await tx.balance.findFirst({
            where:{
                userId:Number(fromUser)
            }
        })

        if((fromBalance?.amount || 0)<Number(body.amount))
        {
            throw new Error("insuff balance");

        }
       

        await tx.balance.update({
            where:{
                userId:Number(fromUser)
            },
            data:{
                amount:{
                    decrement:Number(body.amount)
                }
            }
        }
        )

        await tx.balance.update({
            where:{
                userId:toUser.id
            },
            data:{
                amount:{
                    increment:Number(body.amount)
                }            
            }
        })

        await tx.p2P.create({
            data:{
                fromUserId:Number(fromUser),
                toUserId:toUser.id,
                amount:Number(body.amount),
                timestamp:new Date()
            }
        })


    })

    return NextResponse.json({
        msg:"transfer done"
    })

}