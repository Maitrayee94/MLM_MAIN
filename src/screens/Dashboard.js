import React, { useState, useEffect } from "react";
import { useMetaMask } from "../hooks/useMetamask";
import { ethers } from "ethers";
import {
  CUSTOM_TOKEN_ADDRESS,
  CUSTOM_TOKEN_ABI,
  STAKING_CONTRACT_ADDRESS,
  STAKING_ABI,
} from "./constant/index.js";
import GreenFilled from "../assets/green_ball.svg";
import WhiteFilled from "../assets/white_ball.svg";

const Dashboard = ({ setOpenTab }) => {
  const { wallet } = useMetaMask();
  const [account, setAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [stakeBalance, setStakeBalance] = useState(0);
  const [purchasedBalance, setPurchaseBalance] = useState(0);
  const [parent, setParent] = useState(0);
  const [plan, setPlan] = useState("");
  const green = 0;

  useEffect(() => {
    const getWalletBalance = async () => {
      if (account) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            CUSTOM_TOKEN_ADDRESS,
            CUSTOM_TOKEN_ABI,
            signer
          );

          const balance = await contract.balanceOf(account);
          const balanceInEth = ethers.utils.formatEther(balance); // Convert to ethers
          const decBalance = parseFloat(balanceInEth).toFixed(2);
          setTokenBalance(decBalance);
        } catch (error) {
          console.error("Error fetching token balance:", error);
        }
      }
    };

    getWalletBalance(); // Call the function when the component mounts or when the account changes
  }, [account]);

  useEffect(() => {
    const getStakeBalance = async () => {
      if (account) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            STAKING_CONTRACT_ADDRESS,
            STAKING_ABI,
            signer
          );
          console.log(contract);
          const stake_balance = await contract.TotalTokenStaked(account);
          const subscriptionDetail = await contract.userSubscription(account);
          const allreferral = await contract.showAllParent(account);

          for (var i = 0; i < allreferral.length; i++) {
            if (
              allreferral[i] !== "0x0000000000000000000000000000000000000000"
            ) {
              green++;
            }
          }
          const stakeAmount = subscriptionDetail.tokenAmount;
          setPurchaseBalance(stakeAmount.toNumber());

          const stake_balanceInEth = ethers.utils.formatEther(stake_balance); // Convert to ethers
          const stake_decBalance = parseFloat(stake_balanceInEth).toFixed(2);

          setStakeBalance(stake_decBalance / 1000000000000000000);
        } catch (error) {
          console.error("Error fetching token balance:", error);
        }
      }
    };

    getStakeBalance(); // Call the function when the component mounts or when the account changes
  }, [account]);

  useEffect(() => {
    const getPlan = async () => {
      if (account) {
        try {
          if (stakeBalance <= 10000) {
            setPlan("None");
          } else if (stakeBalance > 10000 && stakeBalance <= 50000) {
            setPlan("Bronze");
          } else if (stakeBalance > 50000 && stakeBalance <= 100000) {
            setPlan("Silver");
          } else if (stakeBalance > 100000 && stakeBalance <= 250000) {
            setPlan("Gold");
          } else if (stakeBalance > 250000 && stakeBalance <= 400000) {
            setPlan("Platinum");
          } else if (stakeBalance > 400000) {
            setPlan("Diamond");
          }
        } catch (error) {
          console.error("Error fetching token balance:", error);
        }
      }
    };

    getPlan(); // Call the function when the component mounts or when the account changes
  }, [account]);

  return (
    <div className="flex w-full justify-center  p-10 md:px-20  md:pb-20 flex-col h-full dashboard">
      <div className="grid gap-4 md:grid-cols-3  w-full">
        <div className="dcard text-white md:max-w-md w-full md:p-6 p-4 rounded-xl">
          <div className="flex flex-col">
            <h1 className="text-base">Stake wallet {plan}</h1>
            <h1 className="text-2xl md:text-2xl my-2">
              <span className="font-semibold">{stakeBalance}</span>
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="connect-wallet cursor-pointer p-3 flex gap-4 items-center justify-center rounded-lg text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
              >
                <path
                  d="M18 4L14 0V3H7V5H14V8M4 6L0 10L4 14V11H11V9H4V6Z"
                  fill="white"
                />
              </svg>{" "}
              <p>Unstake</p>
            </div>
            <div
              className="connect-wallet cursor-pointer p-3 flex gap-4 items-center justify-center rounded-lg text-center"
              onClick={() => setOpenTab(4)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="17"
                viewBox="0 0 12 17"
                fill="none"
              >
                <path
                  d="M10 10.75V8.75H11.61C11.85 9.46 12 10.14 12 10.75H10ZM9.58 4.75C9.12 4.04 8.65 3.36 8.2 2.75H8V4.75H9.58ZM10 8.75V6.75H8V8.75H10ZM10 5.43V6.75H10.74C10.5 6.31 10.26 5.86 10 5.43ZM6 12.75V10.75H8V8.75H6V6.75H8V4.75H6V2.75H8V2.48C6.9 1.01 6 0 6 0C6 0 0 6.75 0 10.75C0 14.06 2.69 16.75 6 16.75V14.75H8V12.75H6ZM8 16.4C8.75 16.14 9.42 15.75 10 15.21V14.75H8V16.4ZM8 12.75H10V10.75H8V12.75ZM10 14.75H10.46C11 14.17 11.39 13.5 11.65 12.75H10V14.75Z"
                  fill="white"
                />
              </svg>{" "}
              <p>Stake Transaction</p>
            </div>
          </div>
        </div>
        <div className="dcard text-white md:max-w-md w-full md:p-6 p-4 rounded-xl">
          <div className="flex flex-col">
            <h1 className="text-base">Regular wallet</h1>
            <h1 className="text-2xl md:text-2xl my-2">
              <span className="font-semibold">{tokenBalance} </span>
            </h1>
          </div>
          <div className="flex justify-center ">
            <div className="connect-wallet cursor-pointer p-3 w-1/2 flex gap-4 items-center justify-center rounded-lg text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="17"
                viewBox="0 0 12 17"
                fill="none"
              >
                <path
                  d="M10 10.75V8.75H11.61C11.85 9.46 12 10.14 12 10.75H10ZM9.58 4.75C9.12 4.04 8.65 3.36 8.2 2.75H8V4.75H9.58ZM10 8.75V6.75H8V8.75H10ZM10 5.43V6.75H10.74C10.5 6.31 10.26 5.86 10 5.43ZM6 12.75V10.75H8V8.75H6V6.75H8V4.75H6V2.75H8V2.48C6.9 1.01 6 0 6 0C6 0 0 6.75 0 10.75C0 14.06 2.69 16.75 6 16.75V14.75H8V12.75H6ZM8 16.4C8.75 16.14 9.42 15.75 10 15.21V14.75H8V16.4ZM8 12.75H10V10.75H8V12.75ZM10 14.75H10.46C11 14.17 11.39 13.5 11.65 12.75H10V14.75Z"
                  fill="white"
                />
              </svg>{" "}
              <p>Join</p>
            </div>
          </div>
        </div>
        <div className="">
          <div className="dcard text-white mb-2 md:max-w-md w-full md:p-6 p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 13.5C9.31875 13.5 12 16.1812 12 19.5C12 22.8187 9.31875 25.5 6 25.5C2.68125 25.5 0 22.8187 0 19.5C0 16.1812 2.68125 13.5 6 13.5ZM20.25 22.5C21.2446 22.5 22.1984 22.8951 22.9017 23.5984C23.6049 24.3016 24 25.2554 24 26.25C24 27.2446 23.6049 28.1984 22.9017 28.9016C22.1984 29.6049 21.2446 30 20.25 30C19.2554 30 18.3016 29.6049 17.5983 28.9016C16.8951 28.1984 16.5 27.2446 16.5 26.25C16.5 25.2554 16.8951 24.3016 17.5983 23.5984C18.3016 22.8951 19.2554 22.5 20.25 22.5ZM21 0C22.1819 0 23.3522 0.232792 24.4442 0.685084C25.5361 1.13738 26.5282 1.80031 27.364 2.63604C28.1997 3.47177 28.8626 4.46392 29.3149 5.55585C29.7672 6.64778 30 7.8181 30 9C30 13.9688 25.9688 18 21 18C18.6131 18 16.3239 17.0518 14.636 15.364C12.9482 13.6761 12 11.3869 12 9C12 4.03125 16.0312 0 21 0Z"
                  fill="white"
                />
              </svg>

              <h1 className="ml-4 text-base">Total Earning rewards</h1>
            </div>
            <h1 className="text-2xl md:text-2xl my-2">
              <span className="font-semibold">{}</span>
            </h1>
          </div>
          <div className="dcard text-white mt-2 md:max-w-md w-full md:p-6 p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 13.5C9.31875 13.5 12 16.1812 12 19.5C12 22.8187 9.31875 25.5 6 25.5C2.68125 25.5 0 22.8187 0 19.5C0 16.1812 2.68125 13.5 6 13.5ZM20.25 22.5C21.2446 22.5 22.1984 22.8951 22.9017 23.5984C23.6049 24.3016 24 25.2554 24 26.25C24 27.2446 23.6049 28.1984 22.9017 28.9016C22.1984 29.6049 21.2446 30 20.25 30C19.2554 30 18.3016 29.6049 17.5983 28.9016C16.8951 28.1984 16.5 27.2446 16.5 26.25C16.5 25.2554 16.8951 24.3016 17.5983 23.5984C18.3016 22.8951 19.2554 22.5 20.25 22.5ZM21 0C22.1819 0 23.3522 0.232792 24.4442 0.685084C25.5361 1.13738 26.5282 1.80031 27.364 2.63604C28.1997 3.47177 28.8626 4.46392 29.3149 5.55585C29.7672 6.64778 30 7.8181 30 9C30 13.9688 25.9688 18 21 18C18.6131 18 16.3239 17.0518 14.636 15.364C12.9482 13.6761 12 11.3869 12 9C12 4.03125 16.0312 0 21 0Z"
                  fill="white"
                />
              </svg>

              <h1 className="text-base ml-4">Team Size</h1>
            </div>

            <h1 className="text-2xl md:text-2xl my-2">
              <span className="font-semibold">35000 MJC</span>
            </h1>
          </div>
        </div>
      </div>
      <h1 className="text-white mt-9 mb-8">Your Levels</h1>
      <div className="grid gap-4 md:grid-cols-4  w-full">
        <div className="dcard text-yellow-300 md:max-w-md w-full md:p-6 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <h1 className="text-base">50$</h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span className="font-semibold">Levelreached</span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(green)].map((e, i) => (
              <img src={GreenFilled} alt="green"></img>
            ))}
            {[...Array(10 - green)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
        <div className="dcard text-red md:max-w-md w-full md:p-6 p-4 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-base">100$</h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span className="font-semibold text-red-600">Levellocked </span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(10)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
        <div className="dcard text-red md:max-w-md w-full md:p-6 p-4 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-base">200$</h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span className="font-semibold text-red-600">Levellocked </span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(10)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
        <div className="dcard  md:max-w-md w-full md:p-6 p-4 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-base">500$</h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span className="font-semibold text-red-600">Levellocked </span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(10)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
        <div className="dcard  md:max-w-md w-full md:p-6 p-4 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-base">1000$</h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span className="font-semibold text-red-600">Levellocked </span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(10)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
