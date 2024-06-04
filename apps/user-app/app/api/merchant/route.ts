import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";


export async function POST(req:NextRequest){
    const session=await getServerSession(authOptions);
    const fromUser=session?.user.id
    console.log(fromUser)

    const body=await req.json();
    console.log(body)
    if(!fromUser)
    {
        return NextResponse.json({
            msg:"error"
        })
        
    }
    const merchant=await prisma.merchant.findFirst({
        where:{
            name:body.to
            
        },select:{
            email:true,
            mer_amount:true,
            id:true,
            name:true
        }
    })
    console.log(merchant)
      

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

        await tx.merchant.update({
            where:{
                email:merchant?.email
            },
            data:{
                mer_amount:{
                    increment:Number(body.amount)
                }
            }
        })
        await tx.merchTransaction.create({
            data:{
                userId:Number(fromUser),
                merchantName:merchant?.name || "",
                amount:Number(body.amount),
                timestamp:new Date()
            }
        })


    })

    return NextResponse.json({
        msg:"transfer done"
    })

}

export async function PUT(){
    const res=await prisma.merchant.delete({
       where:{
        email:"zomato@gmail.com",
        
       }
    })
    return NextResponse.json({
        res
    })
}