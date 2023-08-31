import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "../hooks/useMetamask";
import { STAKING_CONTRACT_ADDRESS, STAKING_ABI } from "./constant/index.js";

const StakingTable = (props) => {
  const { wallet } = useMetaMask();
  const [account, setAccount] = useState("");
  const [tableData, setTableData] = useState([]);
  const [planCount, setPlanCount] = useState(0);
  const [parent, setParent] = useState("");
  const [sub_amount, setSubAmount] = useState(0)
  const [tier, setTier] = useState();


  useEffect(() => {
    if (wallet && wallet.accounts && wallet.accounts.length > 0) {
      setAccount(wallet.accounts[0]);
    }
  }, [wallet]);

  useEffect(() => {
    const readingData = async () => {
      if (account) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            STAKING_CONTRACT_ADDRESS,
            STAKING_ABI,
            signer
          );
          // Fetch the number of stakes made by the user
          
          const parent = await contract.getParent(account);
          //console.log(parent);
          const userStakeCount = await contract.userCount(account);
          const userCountDecimal = parseInt(userStakeCount, 16);
          const user_sub = await contract.userSubscription(account);
          //setUserSub(user_sub);
          setParent(user_sub.parent);
          setSubAmount(user_sub.tokenAmount.toNumber());
          setTier(user_sub.tier.toNumber());
          console.log(user_sub);
          // Fetch and process staking details for each stake
          const stakingDetails = [];
          for (let index = 101; index <= 100 + userCountDecimal; index++) {
            const user = await contract.users(account, index);

            // Process the data and create an object
            const stakedAmount = ethers.utils.formatEther(user.stakedAmount); // Convert to ETH
            //console.log(stakedAmount);
            const stakingEndTimeInSeconds = user.stakingEndTime.toNumber();
            //console.log(stakingEndTimeInSeconds);
            const currentBlockTime = Math.floor(Date.now() / 1000);
            //console.log(currentBlockTime);
            const endDateTime = new Date(stakingEndTimeInSeconds * 1000); // Convert to milliseconds
            //console.log(endDateTime);
            const endDate = endDateTime.toLocaleString();
            //console.log(endDate);
            const StartDate = user.StartDate.toNumber();
            
            const StartDateTime = new Date(StartDate * 1000)
            //console.log(StartDateTime);
            const startdate = StartDateTime.toLocaleString();
            console.log(startdate);
            const remainingDays = Math.max(
              0,
              Math.floor(
                (stakingEndTimeInSeconds - currentBlockTime) / (60 * 60 * 24)
              )
            );
            console.log(remainingDays);
            

            // Create an object with the data
            const rowData = {
              id: index,
              stakedAmount,
              daysLeft: remainingDays,
              endDate,
              parent,
              startdate,
            };

            // Add the staking details to the array
            stakingDetails.push(rowData);
          }
          console.log(stakingDetails)

          // Update the tableData array with the new data
          setTableData(stakingDetails);
          console.log(tableData);

          // Count unique plans
          const uniquePlans = new Set(stakingDetails.map((data) => data.plan));
          setPlanCount(uniquePlans.size);
        } catch (error) {
          console.error(error);
        }
      }
    };

    readingData();
  }, [account]);

  return (
    <div>
      <div className="relative overflow-x-auto m-4 w-full bg-[#17181A]">
        <div className="text-sm sm:text-base block bg-[#17181A] rounded-lg text-white w-full p-3 ">
          <p className="p-2 inline-block">Your Staking Details</p>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-sm sm:text-base bg-[#1D2B26] rounded-lg text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Staked Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Days Left
              </th>
              <th scope="col" className="px-6 py-3">
                Parent Id
              </th>
              
              <th scope="col" className="px-6 py-3">
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr
                key={index}
                className="bg-[#1E1E1F] border-t border-[#444242] text-white"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{data.stakedAmount}</td>
                <td className="px-6 py-4">{data.daysLeft}</td>
                <td className="px-6 py-4">{data.parent}</td>
                
                <td className="px-6 py-4">{data.startdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative overflow-x-auto m-4 w-full bg-[#17181A]">
        <div className="text-sm sm:text-base block bg-[#17181A] rounded-lg text-white w-full p-3 ">
          <p className="p-2 inline-block">Your Purchase Details</p>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-sm sm:text-base bg-[#1D2B26] rounded-lg text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Purchase Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Parent Id
              </th>
              <th scope="col" className="px-6 py-3">
                Tier
              </th>
    
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr
                key={index}
                className="bg-[#1E1E1F] border-t border-[#444242] text-white"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{sub_amount}</td>
<td className="px-6 py-4">{parent}</td>
<td className="px-6 py-4">{tier}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StakingTable;
