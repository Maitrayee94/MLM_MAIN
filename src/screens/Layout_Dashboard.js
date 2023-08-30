import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import Dashboard from "./Dashboard";
import Staking from "./Staking";
import { useMetaMask } from "../hooks/useMetamask";
import StakingTable from "../components/StakingTable";
import Buy_Subscription from "./Buy_Subscription";
const Layout_Dashboard = () => {
  const [openTab, setOpenTab] = React.useState(1);
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();
  console.log(wallet);
  return (
    <div className="">
      <div className="flex items-center  md:px-20 md:py-6 p-10 justify-between">
        <img src="/assets/randomz.svg" height={40} width={40} alt="" />
        {wallet.accounts[0] ? (
          <button className="leading-3 w-full max-w-fit py-4 justify-center flex items-center p-3 text-center rounded-md   connect-wallet  text-white font-bold ">
            {wallet.accounts[0].slice(0, 6)}...{wallet.accounts[0].slice(-4)}{" "}
          </button>
        ) : (
          <button
            onClick={connectMetaMask}
            className="leading-3 w-full max-w-fit py-4 justify-center flex items-center p-3 text-center rounded-md   connect-wallet  text-white font-bold "
          >
            Connect wallet
          </button>
        )}
      </div>
      <DashboardNavbar setOpenTab={setOpenTab} />
      {openTab === 1 ? (
        <Dashboard setOpenTab={setOpenTab} />
      ) : openTab == 2 ? (
        <Staking wallet={wallet} />
      ) : openTab == 3 ? (
        <Buy_Subscription wallet={wallet} />
      ) : (
        <StakingTable />
      )}
    </div>
  );
};

export default Layout_Dashboard;
