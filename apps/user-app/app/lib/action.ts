"use server"

import prisma from "@repo/db/client";



export async function getUsers(){
    const users=await prisma.user.findMany({
        select:{
            email:true
        }
    })
    return users;
}


export async function getMerchants(){
    const merchants=await prisma.merchant.findMany({
        select:{
            name:true
        }
    })
    return merchants
}