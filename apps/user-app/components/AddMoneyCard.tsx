"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { useSession } from "next-auth/react";
import {  useRouter } from "next/navigation";

import axios from "axios";
import { Toast } from "@repo/ui/toast";

const BACKEND_URL="http://ec2-13-51-72-244.eu-north-1.compute.amazonaws.com:3001"

const SUPPORTED_BANKS = [
    {name: "HDFC Bank"}, 
    {name: "Axis Bank"},
    {name: "SCB Bank"},
    {name: "Citi Bank"},



];

export const AddMoney = () => {
  
    const [amount,setAmount]=useState(0);
    const[provider,setProvider]=useState(SUPPORTED_BANKS[0]?.name || "none") ;
    const user=useSession().data?.user;
    const [toast,setToast]=useState(false)
    const router=useRouter()


    return<div>
    
    <Card title="Add Money">
    <div className="w-full">
        <TextInput label={"Amount"} placeholder={"Amount"} onChange={(amt) => {
            setAmount(Number(amt));

        }} />
        <div className="py-4 text-left">
            Bank
        </div>
        <Select onSelect={(value) => {
            
            setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "")

        }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />
        <div className="flex justify-center pt-4">
            <Button onClick={async () => {
               const res=await axios.post(`${BACKEND_URL}/api/user`,{
                amount:amount*100,
                provider
               })
               setToast(true)

               setTimeout(()=>setToast(false),3000)
               setTimeout(()=>router.push("/dashboard"),5000)
               
            }}>
            Add Money
            </Button>
        </div>
    </div>
    </Card>
    {toast?<Toast />:<></>}


</div>
}