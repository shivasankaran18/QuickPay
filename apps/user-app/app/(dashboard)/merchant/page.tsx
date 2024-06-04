import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { MerchantCard } from "../../../components/MerchantCard";
import { P2PCard } from "../../../components/P2PMoney";







export default function Merchant(){

    return(
        <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
          Pay To Merchant 
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
          <div>
           <MerchantCard />
          </div>
          <div>
            <BalanceCard  />
            
          </div>
        </div>

      </div>

    )
}