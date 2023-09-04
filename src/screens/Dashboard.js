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
import { FcLock } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";

const Dashboard = ({ setOpenTab }) => {
  const { wallet } = useMetaMask();
  const [account, setAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [stakeBalance, setStakeBalance] = useState(0);
  const [purchasedBalance, setPurchaseBalance] = useState(0);
  const [parent, setParent] = useState(0);
  const [plan, setPlan] = useState("");
  const [tier, setTier] = useState(0);
  const [green, setGreen] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [referAddress, setReferAddress] = useState("");

  useEffect(() => {
    if (wallet && wallet.accounts && wallet.accounts.length > 0) {
      setAccount(wallet.accounts[0]);
    }
  }, [wallet]);

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
          //console.log(contract);
          const stake_balance = await contract.TotalTokenStaked(account);
          const user_rewards = await contract.userRewards(account);
          console.log(user_rewards.toString()); // Log the
          setRewards((user_rewards / 1000000000000000000).toString());
          const subscriptionDetail = await contract.userSubscription(account);
          var allreferral = await contract.showAllChild(account);
          console.log(allreferral);
          const user_tier = subscriptionDetail.tier;
          setTier(user_tier);
          //console.log(user_tier.toNumber());
          var g = 0;
          for (var i = 0; i < allreferral.length; i++) {
            g++;
          }

          console.log(g);
          setGreen(g);
          const stakeAmount = subscriptionDetail.tokenAmount;
          setPurchaseBalance(stakeAmount.toNumber());
          //console.log(plan);
          //console.log(green);
          const stake_balanceInEth = ethers.utils.formatEther(stake_balance);
          //  //console.log(stake_balanceInEth); // Convert to ethers
          const stake_decBalance = (
            parseFloat(stake_balanceInEth) / 1000000000000000000
          ).toFixed(2);
          // console.log(stake_decBalance);
          setStakeBalance(stake_decBalance);
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

  const ref = (e) => {
    e.preventDefault();
    setReferAddress(`https://mjc.com/${account}`);
  };

  return (
    <div className="flex w-full justify-center  p-10 md:px-20  md:pb-20 flex-col h-full dashboard">
      <div className="flex w-1/2 m-auto mb-3">
        <div className="block appearance-none w-full md:w-2/5 bg-transparent border border-[#505352]  py-3 px-4 pr-8 rounded  focus:outline-none focus:bg-[#222223] focus:border-gray-500">
          <span className="text-white">{`https://mjc.com/${account.slice(
            0,
            6
          )}...${account.slice(-4)}`}</span>
        </div>
        <div className="connect-wallet md:ml-3 cursor-pointer flex  w-1/5 items-center justify-center rounded-lg text-center text-white">
          <p onClick={ref}> Copy</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3  w-full">
        <div className="dcard text-white md:max-w-md w-full md:p-6 p-4 rounded-xl">
          <div className="flex flex-col">
            <h1 className="text-base">Stake wallet {plan}</h1>
            <h1 className="text-2xl md:text-2xl my-2">
              <span className="font-semibold">{stakeBalance}</span>
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div
              className="connect-wallet cursor-pointer p-3 flex gap-4 items-center justify-center rounded-lg text-center"
              onClick={() => setOpenTab(2)}
            >
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
              <p>Stake</p>
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
          <div className="flex justify-center mt-2">
            <div
              className="connect-wallet cursor-pointer p-3 w-1/2 flex gap-4 items-center justify-center rounded-lg text-center"
              onClick={() => setOpenTab(3)}
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
              <span className="font-semibold">{rewards}</span>
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
            <h1
              className={`text-base ${
                tier == 50 ? "text-yellow-600" : "text-white"
              }`}
            >
              50$
            </h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span
                className={`font-semibold ${
                  tier == 50 ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {tier == 50 ? (
                  green == 10 ? (
                    <FcApproval />
                  ) : (
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 16L3 12L4.41 10.59L7 13.17L13.59 6.58L15 8M9 0L0 4V10C0 15.55 3.84 20.74 9 22C14.16 20.74 18 15.55 18 10V4L9 0Z"
                        fill="#E0F850"
                      />
                    </svg>
                  )
                ) : (
                  <FcLock />
                )}
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(tier == 50 ? green : 0)].map((e, i) => (
              <img src={GreenFilled} alt="green"></img>
            ))}
            {[...Array(tier == 50 ? 10 - green : 10)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
        <div className="dcard text-red md:max-w-md w-full md:p-6 p-4 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <h1
              className={`text-base ${
                tier == 100 ? "text-yellow-600" : "text-white"
              }`}
            >
              100$
            </h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span
                className={`font-semibold ${
                  tier == 100 ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {tier == 100 ? (
                  green == 10 ? (
                    <FcApproval />
                  ) : (
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 16L3 12L4.41 10.59L7 13.17L13.59 6.58L15 8M9 0L0 4V10C0 15.55 3.84 20.74 9 22C14.16 20.74 18 15.55 18 10V4L9 0Z"
                        fill="#E0F850"
                      />
                    </svg>
                  )
                ) : (
                  <FcLock />
                )}
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(tier == 100 ? green : 0)].map((e, i) => (
              <img src={GreenFilled} alt="green"></img>
            ))}
            {[...Array(tier == 100 ? 10 - green : 10)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
        <div className="dcard text-red md:max-w-md w-full md:p-6 p-4 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <h1
              className={`text-base ${
                tier == 200 ? "text-yellow-600" : "text-white"
              }`}
            >
              200$
            </h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span
                className={`font-semibold ${
                  tier == 200 ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {tier == 200 ? (
                  green == 10 ? (
                    <FcApproval />
                  ) : (
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 16L3 12L4.41 10.59L7 13.17L13.59 6.58L15 8M9 0L0 4V10C0 15.55 3.84 20.74 9 22C14.16 20.74 18 15.55 18 10V4L9 0Z"
                        fill="#E0F850"
                      />
                    </svg>
                  )
                ) : (
                  <FcLock />
                )}
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(tier == 200 ? green : 0)].map((e, i) => (
              <img src={GreenFilled} alt="green"></img>
            ))}
            {[...Array(tier == 200 ? 10 - green : 10)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
        <div className="dcard  md:max-w-md w-full md:p-6 p-4 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <h1
              className={`text-base ${
                tier == 500 ? "text-yellow-600" : "text-white"
              }`}
            >
              500$
            </h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span
                className={`font-semibold ${
                  tier == 500 ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {tier == 500 ? (
                  green == 10 ? (
                    <FcApproval />
                  ) : (
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 16L3 12L4.41 10.59L7 13.17L13.59 6.58L15 8M9 0L0 4V10C0 15.55 3.84 20.74 9 22C14.16 20.74 18 15.55 18 10V4L9 0Z"
                        fill="#E0F850"
                      />
                    </svg>
                  )
                ) : (
                  <FcLock />
                )}
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(tier == 500 ? green : 0)].map((e, i) => (
              <img src={GreenFilled} alt="green"></img>
            ))}
            {[...Array(tier == 500 ? 10 - green : 10)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
        <div className="dcard  md:max-w-md w-full md:p-6 p-4 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <h1
              className={`text-base ${
                tier == 1000 ? "text-yellow-600" : "text-white"
              }`}
            >
              1000$
            </h1>
            <h1 className="text-2xl md:text-2xl gap-2 flex  items-center">
              <span
                className={`font-semibold ${
                  tier == 1000 ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {" "}
                {tier == 1000 ? (
                  green == 10 ? (
                    <FcApproval />
                  ) : (
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 16L3 12L4.41 10.59L7 13.17L13.59 6.58L15 8M9 0L0 4V10C0 15.55 3.84 20.74 9 22C14.16 20.74 18 15.55 18 10V4L9 0Z"
                        fill="#E0F850"
                      />
                    </svg>
                  )
                ) : (
                  <FcLock />
                )}
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {[...Array(tier == 1000 ? green : 0)].map((e, i) => (
              <img src={GreenFilled} alt="green"></img>
            ))}
            {[...Array(tier == 1000 ? 10 - green : 10)].map((e, i) => (
              <img src={WhiteFilled} alt="white"></img>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
