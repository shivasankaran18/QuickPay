
import { useState } from "react";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2PCard } from "../../../components/P2PMoney";



export default function Home(){
  
    return(
        <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
          Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
          <div>
           <P2PCard />
          </div>
          <div>
            <BalanceCard  />
            
          </div>
        </div>

      </div>
    )
}