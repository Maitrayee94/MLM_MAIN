import React from "react";
import { ethers, utils, providers } from "ethers";
import { useState, useEffect } from "react";
import { useMetaMask } from "../hooks/useMetamask";
import {
  STAKING_CONTRACT_ADDRESS,
  STAKING_ABI,
  CUSTOM_TOKEN_ADDRESS,
  CUSTOM_TOKEN_ABI,
} from "./constant/index.js";
import "./Modal.css";

const Buy_Subscription = (props) => {
  const [teamsize, setTeamsize] = useState(0);
  const [address, setAddress] = useState("");
  const [directAmount, setDirectAmount] = useState(0);
  const [directAddress, setDirectAddress] = useState("");
  const [tier, setTier] = useState(0);
  const fees = 10;
  const [approve_amount, setApproveAmount] = useState(0);

  const { wallet } = useMetaMask();
  const [account, setAccount] = useState("");
  const [buyValue, setBuyValue] = useState(0);

  useEffect(() => {
    if (wallet && wallet.accounts && wallet.accounts.length > 0) {
      setAccount(wallet.accounts[0]);
    }
  }, [wallet]);

  const buyToken = async (event) => {
    event.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        signer
      );
      var buy_amount = 0;
      var stake_amount = 0;
      if (tier == 50) {
        buy_amount = 42.5;
        stake_amount = 7.5;
      } else if (tier == 100) {
        buy_amount = 85;
        stake_amount = 15;
      } else if (tier == 200) {
        buy_amount = 170;
        stake_amount = 30;
      } else if (tier == 500) {
        buy_amount = 425;
        stake_amount = 75;
      } else {
        buy_amount = 850;
        stake_amount = 150;
      }
      //console.log(amount);
      const tx = await contract.buyTokens(address, buy_amount, tier, fees);
      console.log(tx);
      // wait for the transaction to get mined
      await tx.wait();
      if (tx == "false") {
        window.alert("Buy Failed");
      }
      window.alert("You successfully subscribed to MJC token");
      //console.log(tx);
      //setHash(tx.hash);

      const userStakeCount = await contract.userCount(account);
      const StakeCount = parseInt(userStakeCount, 16);
      //console.log(amount, duration, teamsize);
      //console.log(StakeCount);
      const Staking_tx = await contract.stakeTokens(
        stake_amount,
        180,
        0,
        StakeCount + 101
      );
      // wait for the transaction to get mined
      await Staking_tx.wait();
      if (Staking_tx == "false") {
        window.alert("Staking Failed");
      }
      window.alert("You are Successfully Staked Your token");
      //console.log(tx);
      //setHash(tx.hash);
      console.log(tx.hash);
    } catch (error) {
      console.error(error);
    }
  };
  const directStaking = async (event) => {
    event.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        signer
      );

      const tx = await contract.DirectStakeJoining(directAddress, directAmount);
      console.log(tx);
      // wait for the transaction to get mined
      await tx.wait();
      if (tx == "false") {
        window.alert("Stake Joining Failed");
      }
      window.alert("You successfully Joined");
      //console.log(tx);
      //setHash(tx.hash);
      console.log(tx.hash);
    } catch (error) {
      console.error(error);
    }
  };
  const approve = (e) => {
    e.preventDefault();
    setApproveAmount(e.target.value);
  };
  const approveButton = async (event) => {
    event.preventDefault();
    try {
      setApproveAmount(event.target.value);
      //console.log(approve_amount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const Staking_contract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        signer
      );
      const Token_contract = new ethers.Contract(
        CUSTOM_TOKEN_ADDRESS,
        CUSTOM_TOKEN_ABI,
        signer
      );
      const tx = await Token_contract.approve(
        Staking_contract.address,
        approve_amount
      );
      console.log(tx);
      // wait for the transaction to get mined
      await tx.wait();
      if (tx == "false") {
        window.alert("Approved Failed");
      }
      window.alert("Your tokens are approved successfully");
    } catch (error) {
      console.error(error);
    }
  };
  window.onclick = function (event) {
    var modal = document.getElementById("myModal");

    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  const a = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  };

  const close = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  };

  return (
    <React.Fragment>
      <div id="myModal" className="modal">
        <div className="modal-content flex justify-between items-center bg-black text-white rounded-lg shadow-[#222223] shadow-md">
          <p>
            If you choose {tier} tier then you will have to buy for {buyValue}
          </p>
          <span className="close cursor-pointer" onClick={close}>
            &times;
          </span>
        </div>
      </div>

      <div className="flex flex-col mt-7 items-start dashboard">
        <div className="flex flex-col stakingcard items-center text-white p-5 md:px-20 m-auto w-[70%] md:w-11/12 md:flex-row rounded-lg shadow-[#222223] shadow-md">
          <div className="md:mr-5 m-auto w-[90%] ">
            <h1 className="mb-2">
              Register to MLM platform by buying any plan below
            </h1>
            <p>
              You investment ID will be activated only after 1st puchase.
              Approve your spendings from smart contract before proceeding.
            </p>
          </div>
          <div className="hidden md:block">
            <svg
              width="2"
              height="98"
              viewBox="0 0 2 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="1" y1="97.0026" x2="1" y2="0.997353" stroke="#0FCA87" />
            </svg>
          </div>

          <div className="mt-10 md:ml-5 flex flex-col">
            <h1 className="mb-2"> Enter Spending</h1>

            <div className="flex flex-col md:flex-row">
              <input
                className=" shadow appearance-none border rounded w-full border-[#505352] p-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                id="amount"
                value={approve_amount}
                onChange={approve}
                type="text"
              ></input>
              <button
                className="bg-[#31A16A] p-3 gap-4 flex items-center justify-center rounded-md mt-4 md:mt-0"
                onClick={approveButton}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full p-10 md:px-20 gap-5">
          <div className="flex stakingcard flex-col text-white gap-4 p-6  max-w-sm w-full rounded-lg shadow-[#222223] shadow-md">
            <div className="flex md:flex-row flex-col gap-2 items-center justify-between">
              <div className="flex gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="26"
                  viewBox="0 0 18 26"
                  fill="none"
                >
                  <path
                    d="M15 16.125V13.125H17.415C17.775 14.19 18 15.21 18 16.125H15ZM14.37 7.125C13.68 6.06 12.975 5.04 12.3 4.125H12V7.125H14.37ZM15 13.125V10.125H12V13.125H15ZM15 8.145V10.125H16.11C15.75 9.465 15.39 8.79 15 8.145ZM9 19.125V16.125H12V13.125H9V10.125H12V7.125H9V4.125H12V3.72C10.35 1.515 9 0 9 0C9 0 0 10.125 0 16.125C0 21.09 4.035 25.125 9 25.125V22.125H12V19.125H9ZM12 24.6C13.125 24.21 14.13 23.625 15 22.815V22.125H12V24.6ZM12 19.125H15V16.125H12V19.125ZM15 22.125H15.69C16.5 21.255 17.085 20.25 17.475 19.125H15V22.125Z"
                    fill="#FCFCFC"
                  />
                </svg>
                <p> Buy MJC Tokens</p>
              </div>
              <button className="bg-[#0B8C5E] w-full md:w-fit mt-4 px-4 py-3 rounded-md">
                View slab
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div class="mb-4">
                <label class="block  text-sm font-bold mb-2" for="username">
                  Enter referrer wallet address
                </label>
                <input
                  class="shadow appearance-none border rounded w-full border-[#505352] p-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                />
              </div>
            </div>

            <div class="w-full">
              <label
                class="block  tracking-wide  text-sm font-bold mb-2"
                for="grid-state"
              >
                Buy plan
              </label>
              <div class="relative">
                <select
                  class="block appearance-none w-full  bg-transparent border border-[#505352]  py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-[#222223] focus:border-gray-500"
                  id="grid-state"
                  value={tier}
                  onChange={(e) => {
                    if (e.target.value == 100) {
                      setBuyValue(85);
                      a();
                    }
                    if (e.target.value == 200) {
                      setBuyValue(170);
                      a();
                    }
                    if (e.target.value == 500) {
                      setBuyValue(475);
                      a();
                    }
                    if (e.target.value == 1000) {
                      setBuyValue(850);
                      a();
                    }
                    setTier(e.target.value);
                  }}
                  type="number"
                >
                  <option>50</option>
                  <option>100</option>
                  <option>200</option>
                  <option>500</option>
                  <option>1000</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#31A16A] p-3 gap-4 cursor-pointer flex  items-center justify-center rounded-md">
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
              <p onClick={buyToken}> Purchase tokens</p>
            </div>
          </div>
          <div className="flex stakingcard flex-col text-white gap-4 p-6  max-w-sm w-full rounded-lg shadow-[#222223] shadow-md">
            <div className="flex md:flex-row flex-col gap-2 items-center justify-between">
              <div className="flex gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="26"
                  viewBox="0 0 18 26"
                  fill="none"
                >
                  <path
                    d="M15 16.125V13.125H17.415C17.775 14.19 18 15.21 18 16.125H15ZM14.37 7.125C13.68 6.06 12.975 5.04 12.3 4.125H12V7.125H14.37ZM15 13.125V10.125H12V13.125H15ZM15 8.145V10.125H16.11C15.75 9.465 15.39 8.79 15 8.145ZM9 19.125V16.125H12V13.125H9V10.125H12V7.125H9V4.125H12V3.72C10.35 1.515 9 0 9 0C9 0 0 10.125 0 16.125C0 21.09 4.035 25.125 9 25.125V22.125H12V19.125H9ZM12 24.6C13.125 24.21 14.13 23.625 15 22.815V22.125H12V24.6ZM12 19.125H15V16.125H12V19.125ZM15 22.125H15.69C16.5 21.255 17.085 20.25 17.475 19.125H15V22.125Z"
                    fill="#FCFCFC"
                  />
                </svg>
                <p> Direct Staking</p>
              </div>
              <button className="bg-[#0B8C5E] w-full md:w-fit mt-4 px-4 py-3 rounded-md">
                View slab
              </button>
            </div>
            <div className="flex flex-col gap-4 justify-between h-full">
              <div className="flex flex-col ">
                <div className="mb-4">
                  <label class="block  text-sm font-bold mb-2" for="username">
                    Enter referrer wallet address
                  </label>
                  <input
                    class="shadow appearance-none border rounded w-full border-[#505352] p-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                    id="address"
                    value={directAddress}
                    onChange={(e) => setDirectAddress(e.target.value)}
                    type="text"
                  />
                  <div class="mt-4 mb-4">
                    <label class="block  text-sm font-bold mb-2" for="username">
                      Enter amount
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full border-[#505352] p-3 bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                      id="amount"
                      value={directAmount}
                      onChange={(e) => setDirectAmount(e.target.value)}
                      type="number"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-[#31A16A] p-3 gap-4 flex  cursor-pointer items-center justify-center rounded-md">
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
                <p onClick={directStaking}> Direct Stake</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Buy_Subscription;
