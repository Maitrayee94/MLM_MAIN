import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "../hooks/useMetamask";
import { STAKING_CONTRACT_ADDRESS, STAKING_ABI } from "./constant/index.js";

const StakingTable = (props) => {
  const { wallet } = useMetaMask();
  const [account, setAccount] = useState("");
  const [tableData, setTableData] = useState([]);
  const [planCount, setPlanCount] = useState(0);

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
          const userStakeCount = await contract.userCount(account);
          const userCountDecimal = parseInt(userStakeCount, 16);
           // console.log(userCountDecimal);
          // Fetch and process staking details for each stake
          const stakingDetails = [];
          for (let index = 101; index <= 100+userCountDecimal; index++) {
            const user = await contract.users(account, index);

            // Process the data and create an object
            const stakedAmount = ethers.utils.formatEther(user.stakedAmount); // Convert to ETH
            console.log(stakedAmount);
            const stakingEndTimeInSeconds = user.stakingEndTime.toNumber();
            const currentBlockTime = Math.floor(Date.now() / 1000);
           
const endDateTime = new Date(stakingEndTimeInSeconds * 1000); // Convert to milliseconds
const endDate = endDateTime.toLocaleString(); 
            const remainingDays = Math.max(
              0,
              Math.floor((stakingEndTimeInSeconds - currentBlockTime) / (60 * 60 * 24))
            );
            const plan = user.plan.toString(); // Convert to string

            // Create an object with the data
            const rowData = {
              id: index,
              stakedAmount,
              daysLeft: remainingDays,
              endDate,
            };

            // Add the staking details to the array
            stakingDetails.push(rowData);
          }

          // Update the tableData array with the new data
          setTableData(stakingDetails);

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
    <td className="px-6 py-4">{data.endDate}</td>
  </tr>
))}
</tbody>
      </table>
      <div>
        <p>Plan Count: {planCount}</p>
      </div>
    </div>
  );
};

export default StakingTable;
