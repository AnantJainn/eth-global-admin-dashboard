import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setWalletAddress } from "./walletSlice";
import { ethers } from "ethers";

function WalletDialog({ onClose }) {
  const dispatch = useDispatch();
  const [hoveredButton, setHoveredButton] = useState(null);

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

  const styles = {
    dialog: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    dialogContent: {
      backgroundColor: '#181818',
      padding: '25px 30px',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(0,255,234,0.5)',
      color: '#EEE',
      minWidth: '320px',
      textAlign: 'center',
    },
    h3: {
      marginBottom: '20px',
      color: '#00ffc3',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
    },
    button: (isHovered, isCancel = false) => ({
      backgroundColor: isHovered ? (isCancel ? '#ff4d4d' : '#00d1b8') : (isCancel ? '#e63946' : '#00c9a7'),
      border: 'none',
      borderRadius: '6px',
      padding: '10px 20px',
      fontWeight: '600',
      fontSize: '15px',
      color: '#121212',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
      minWidth: '100px',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    }),
  };

  return (
    <div style={styles.dialog}>
      <div style={styles.dialogContent}>
        <h3 style={styles.h3}>Connect Wallet</h3>
        <div style={styles.buttonsContainer}>
          <button
            style={styles.button(hoveredButton === 'connect')}
            onMouseEnter={() => setHoveredButton('connect')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={connectWallet}
          >
            MetaMask
          </button>
          <button
            style={styles.button(hoveredButton === 'cancel', true)}
            onMouseEnter={() => setHoveredButton('cancel')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default WalletDialog;
