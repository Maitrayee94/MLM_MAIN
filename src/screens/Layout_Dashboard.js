import React,{useState, useEffect} from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import Dashboard from "./Dashboard";
import Staking from "./Staking";
import { ethers, utils, providers } from "ethers";
import { useMetaMask } from "../hooks/useMetamask";
import StakingTable from "../components/StakingTable";
import Buy_Subscription from "./Buy_Subscription";
import {
  STAKING_CONTRACT_ADDRESS,
  STAKING_ABI,
  CUSTOM_TOKEN_ADDRESS,
  CUSTOM_TOKEN_ABI,
} from "./constant/index.js";

const Layout_Dashboard = () => {
  const [openTab, setOpenTab] = React.useState(1);
  const [referAddress,setReferAddress] =useState('')
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();
  console.log(wallet);

  const [account, setAccount] = useState("");

  useEffect(() => {
    if (wallet && wallet.accounts && wallet.accounts.length > 0) {
      setAccount(wallet.accounts[0]);
    }
  }, [wallet]);


  const refer =(e)=>{
    e.preventDefault();
    try{
      setReferAddress(e.target.value);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        signer
      );
      const tx = contract.addReferral(account);
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div className="">
      <div className="flex items-center  md:px-20 md:py-6 p-10 justify-between">
        <img src="/assets/randomz.svg" height={40} width={40} alt="" />
        <div className="flex items-center gap-3 w-1/2">
        <div className="w-full">

              <input
                class="shadow appearance-none border rounded w-4/5 border-[#505352] p-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                id="referAddress"
                value={referAddress}
                onChange={refer}
                type="text"
              />
            </div>
            <div className="connect-wallet cursor-pointer p-2 flex gap-4 w-2/5 items-center justify-center rounded-lg text-center text-white">
            
            <p > Refer Address</p>
          </div>
        </div>
        
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
