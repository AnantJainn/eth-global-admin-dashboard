import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWalletAddress } from "./walletSlice";
import { ethers } from "ethers";
import "./WalletDialog.dark.css";  // Import dark CSS

function WalletDialog({ onClose }) {
  const dispatch = useDispatch();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
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
    const handler = (accounts) => {
      dispatch(setWalletAddress(accounts.length > 0 ? accounts[0] : null));
    };
    window.ethereum.on("accountsChanged", handler);
    return () => window.ethereum.removeListener("accountsChanged", handler);
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
