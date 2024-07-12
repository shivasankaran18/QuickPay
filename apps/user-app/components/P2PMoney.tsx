"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import prisma from "@repo/db/client";
import { Select } from "@repo/ui/select";
import { getUsers } from "../app/lib/action";
import { Spinner } from "@repo/ui/spinner";
import { Toast } from "@repo/ui/toast";

const BACKEND_URL="http://ec2-13-51-72-244.eu-north-1.compute.amazonaws.com:3001"




export function P2PCard() {
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState(0);
    const router=useRouter();
    const [users,setusers]=useState<{email:string}[]>([]);
    const [toast,setToast]=useState(false);
   

    useEffect(()=>{
        getUsers().then((val)=>setusers(val))   
    },[])

  
    return <div className="h-[90vh]">
       
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <div>
                        Email
                    </div>

                    <Select  onSelect={(val)=>setEmail(val)}  options={users.map(x => ({
                        key: x.email,
                        value: x.email
                    }))} />


                    
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(Number(value))
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={async () => {
                            const res=await axios.post(`${BACKEND_URL}/api/user/transfer`,{
                                amount:amount*100,
                                to:email
                            })
                            setToast(true)

                            
                            setTimeout(()=>setToast(false),3000)
                            
                            setTimeout(()=>{
                                router.push("/dashboard")
                            },5000)
                           

                        }}>Send</Button>
                    </div>
                    
                </div>
            </Card>
            {toast?<Toast />:<></>}
            
        
       </div>
}

























