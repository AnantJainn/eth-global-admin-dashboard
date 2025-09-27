import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWalletAddress } from "./walletSlice";
import { ethers } from "ethers";

function WalletDialog({ onClose }) {
  const dispatch = useDispatch();

  const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }
  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // 🔑 Force user to sign a message (proof of ownership)
    const message = "Login to SolarNFT dApp";
    const signature = await signer.signMessage(message);

    console.log("Address:", accounts[0]);
    console.log("Signature:", signature);

    dispatch(setWalletAddress(accounts[0]));
    onClose();
  } catch (err) {
    console.error("MetaMask connection error:", err);
  }
};


  useEffect(() => {
    if (!window.ethereum) return;

    // Listen for account changes
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        dispatch(setWalletAddress(accounts[0]));
      } else {
        dispatch(setWalletAddress(null));
      }
    });

    return () => {
      window.ethereum.removeAllListeners("accountsChanged");
    };
  }, [dispatch]);

  return (
    <div className="dialog">
      <div className="dialog-content">
        <h3>Connect Wallet</h3>
        <button onClick={connectWallet}>MetaMask</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default WalletDialog;
