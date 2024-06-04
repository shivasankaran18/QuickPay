import { BalanceCard } from "../../../components/BalanceCard";
import WithdrwaMoney from "../../../components/WithdrawMoneyCard";

export default function(){
    return(
        <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
          Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
          <div>
            <WithdrwaMoney />
          </div>
          <div>
            <BalanceCard  />
            {/* <div className="pt-4">
              <OnRampTransactions transactions={transactions} />
            </div> */}
          </div>
        </div>
      </div>
    )
}