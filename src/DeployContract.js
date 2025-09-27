// // DeployContract.js
// import React, { useState } from "react";
// import { ethers } from "ethers";
// import SolarNFT from "./SolarNFT1.json";

// function DeployContract() {
//   const contractABI = SolarNFT.abi;
//   const contractBytecode = SolarNFT.bytecode;

//   const [form, setForm] = useState({
//     totalKilowatts: "1000",
//     burnPeriodInYears: "1",
//     name: "SolarNFT",
//     symbol: "SNFT",
//     baseURI: "ipfs://your-base-uri/",
//     pricePerNFT: "100", // Price in USDC, e.g., 100
//   });

//   const [deployedAddress, setDeployedAddress] = useState("");
//   const [isDeploying, setIsDeploying] = useState(false);
//   const [txHash, setTxHash] = useState("");

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const deploy = async () => {
//     try {
//       if (!window.ethereum) throw new Error("MetaMask not found");

//       await window.ethereum.request({ method: "eth_requestAccounts" });

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       if (
//         !contractABI ||
//         !Array.isArray(contractABI) ||
//         contractABI.length === 0
//       ) {
//         throw new Error(
//           "Contract ABI is invalid or missing. Check SolarNFT.json"
//         );
//       }
//       if (
//         !contractBytecode ||
//         typeof contractBytecode !== "string" ||
//         contractBytecode.length < 10
//       ) {
//         throw new Error(
//           "Contract bytecode is invalid or missing. Make sure you imported the right artifact (SolarNFT.json)."
//         );
//       }

//       const totalKilowatts = ethers.toBigInt(form.totalKilowatts || "0");
//       const burnPeriodInYears = ethers.toBigInt(form.burnPeriodInYears || "0");
//       const pricePerNFT = ethers.parseUnits(form.pricePerNFT || "0", 6); // USDC is 6 decimals
//       const royaltyBps = 500n; // 5%

//       setIsDeploying(true);
//       setTxHash("");
//       setDeployedAddress("");

//       const factory = new ethers.ContractFactory(
//         contractABI,
//         contractBytecode,
//         signer
//       );

//       const args = [
//         totalKilowatts,
//         burnPeriodInYears,
//         await signer.getAddress(), // defaultAdmin
//         form.name,
//         form.symbol,
//         await signer.getAddress(), // royaltyRecipient
//         royaltyBps,
//         await signer.getAddress(), // primarySaleRecipient
//         form.baseURI,
//         pricePerNFT,
//       ];

//       // --- MODIFICATION: Increased gasLimit to prevent out-of-gas error ---
//       const overrides = {
//         gasLimit: 5_000_000,
//       };

//       console.log("Deploying with args:", args);

//       const contract = await factory.deploy(...args, overrides);

//       const tx = contract.deploymentTransaction();
//       if (tx) {
//         setTxHash(tx.hash);
//         console.log("Deployment tx hash:", tx.hash);
//       }

//       await contract.waitForDeployment();

//       const address = await contract.getAddress();
//       setDeployedAddress(address);
//       console.log("✅ Deployed at:", address);
//     } catch (err) {
//       console.error("Deployment failed:", err);
//       if (err?.code === 4001) {
//         alert("Transaction rejected by user.");
//       } else if (
//         err?.code === "INSUFFICIENT_FUNDS" ||
//         /insufficient funds/i.test(err?.message || "")
//       ) {
//         alert(
//           "Insufficient ETH balance to deploy contract. Add funds to your account."
//         );
//       } else {
//         alert("Deployment failed: " + (err.message || String(err)));
//       }
//     } finally {
//       setIsDeploying(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: 20,
//         maxWidth: 680,
//         fontFamily: "sans-serif",
//         color: "#333",
//       }}
//     >
//       <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
//         Deploy SolarNFT Contract
//       </h2>

//       <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
//         <input
//           style={{ padding: "8px" }}
//           placeholder="Total Kilowatts"
//           name="totalKilowatts"
//           value={form.totalKilowatts}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder="Burn Period (Years)"
//           name="burnPeriodInYears"
//           value={form.burnPeriodInYears}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder="NFT Name"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder="Symbol"
//           name="symbol"
//           value={form.symbol}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder="Base URI"
//           name="baseURI"
//           value={form.baseURI}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder="Price per NFT (USDC)"
//           name="pricePerNFT"
//           value={form.pricePerNFT}
//           onChange={handleChange}
//         />

//         <button
//           onClick={deploy}
//           disabled={isDeploying}
//           style={{
//             padding: "12px",
//             fontWeight: "700",
//             cursor: isDeploying ? "not-allowed" : "pointer",
//             background: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//           }}
//         >
//           {isDeploying ? "Deploying... confirm in MetaMask" : "Deploy"}
//         </button>
//       </div>

//       {txHash && (
//         <div
//           style={{
//             marginTop: 20,
//             background: "#f8f9fa",
//             padding: "10px",
//             borderRadius: "4px",
//           }}
//         >
//           <div>
//             Tx Hash:{" "}
//             <a
//               href={`https://sepolia.etherscan.io/tx/${txHash}`}
//               target="_blank"
//               rel="noreferrer"
//             >
//               {txHash}
//             </a>
//           </div>
//         </div>
//       )}

//       {deployedAddress && (
//         <div
//           style={{
//             marginTop: 12,
//             background: "#e9f7ef",
//             padding: "10px",
//             borderRadius: "4px",
//           }}
//         >
//           <p>
//             <b>✅ Contract deployed at:</b> {deployedAddress}
//           </p>
//           <button
//             onClick={() => navigator.clipboard.writeText(deployedAddress)}
//             style={{ padding: "6px 10px" }}
//           >
//             Copy Address
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DeployContract;
// DeployContract.js
// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";

// // --- MODIFICATION: Import both EVM and Hedera contract artifacts ---
// // Make sure you rename your existing file to SolarNFT_EVM.json
// import EvmSolarNFT from "./SolarNFT_EVM.json";
// // You must provide this file after compiling your contract for Hedera
// import HederaSolarNFT from "./SolarNFT_Hedera.json";

// // --- MODIFICATION: Network configuration constants ---
// const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111
// const HEDERA_TESTNET_CHAIN_ID = "0x128"; // 296

// const SUPPORTED_NETWORKS = {
//   [SEPOLIA_CHAIN_ID]: {
//     name: "Sepolia Testnet",
//     currency: "USDC",
//     explorerUrl: "https://sepolia.etherscan.io",
//     priceDecimals: 6,
//   },
//   [HEDERA_TESTNET_CHAIN_ID]: {
//     name: "Hedera Testnet",
//     currency: "HBAR",
//     explorerUrl: "https://hashscan.io/testnet",
//     priceDecimals: 8,
//   },
// };

// function DeployContract() {
//   // --- MODIFICATION: Add state for network awareness ---
//   const [network, setNetwork] = useState(null);
//   const [isWrongNetwork, setIsWrongNetwork] = useState(false);

//   const [form, setForm] = useState({
//     totalKilowatts: "1000",
//     burnPeriodInYears: "1",
//     name: "SolarNFT",
//     symbol: "SNFT",
//     baseURI: "ipfs://your-base-uri/",
//     pricePerNFT: "100",
//   });

//   const [deployedAddress, setDeployedAddress] = useState("");
//   const [isDeploying, setIsDeploying] = useState(false);
//   const [txHash, setTxHash] = useState("");

//   // --- MODIFICATION: Effect to detect network on load and on change ---
//   useEffect(() => {
//     const handleChainChanged = () => window.location.reload();

//     const checkNetwork = async () => {
//       if (!window.ethereum) return;

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const networkData = await provider.getNetwork();
//       const chainId = `0x${networkData.chainId.toString(16)}`;

//       if (SUPPORTED_NETWORKS[chainId]) {
//         setNetwork(SUPPORTED_NETWORKS[chainId]);
//         setIsWrongNetwork(false);
//       } else {
//         setNetwork({ name: "Unsupported Network" });
//         setIsWrongNetwork(true);
//       }
//     };

//     checkNetwork();
//     window.ethereum.on("chainChanged", handleChainChanged);

//     return () => {
//       window.ethereum.removeListener("chainChanged", handleChainChanged);
//     };
//   }, []);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const deploy = async () => {
//     try {
//       if (!window.ethereum) throw new Error("MetaMask not found");

//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       const networkData = await provider.getNetwork();
//       const chainId = `0x${networkData.chainId.toString(16)}`;

//       // --- MODIFICATION: Select ABI, bytecode, and parse price based on network ---
//       let contractABI, contractBytecode, pricePerNFT;

//       if (chainId === SEPOLIA_CHAIN_ID) {
//         contractABI = EvmSolarNFT.abi;
//         contractBytecode = EvmSolarNFT.bytecode;
//         pricePerNFT = ethers.parseUnits(
//           form.pricePerNFT || "0",
//           SUPPORTED_NETWORKS[SEPOLIA_CHAIN_ID].priceDecimals
//         );
//       } else if (chainId === HEDERA_TESTNET_CHAIN_ID) {
//         contractABI = HederaSolarNFT.abi;
//         contractBytecode = HederaSolarNFT.bytecode;
//         pricePerNFT = ethers.parseUnits(
//           form.pricePerNFT || "0",
//           SUPPORTED_NETWORKS[HEDERA_TESTNET_CHAIN_ID].priceDecimals
//         );
//       } else {
//         throw new Error("Cannot deploy on an unsupported network.");
//       }

//       if (!contractABI || !contractBytecode) {
//         throw new Error(`Contract artifact for ${network.name} is missing.`);
//       }

//       const totalKilowatts = ethers.toBigInt(form.totalKilowatts || "0");
//       const burnPeriodInYears = ethers.toBigInt(form.burnPeriodInYears || "0");
//       const royaltyBps = 500n; // 5%

//       setIsDeploying(true);
//       setTxHash("");
//       setDeployedAddress("");

//       const factory = new ethers.ContractFactory(
//         contractABI,
//         contractBytecode,
//         signer
//       );

//       const args = [
//         totalKilowatts,
//         burnPeriodInYears,
//         await signer.getAddress(),
//         form.name,
//         form.symbol,
//         await signer.getAddress(),
//         royaltyBps,
//         await signer.getAddress(),
//         form.baseURI,
//         pricePerNFT,
//       ];

//       const overrides = { gasLimit: 8_000_000 };

//       console.log(`Deploying on ${network.name} with args:`, args);

//       const contract = await factory.deploy(...args, overrides);

//       const tx = contract.deploymentTransaction();
//       if (tx) {
//         setTxHash(tx.hash);
//         console.log("Deployment tx hash:", tx.hash);
//       }

//       await contract.waitForDeployment();

//       const address = await contract.getAddress();
//       setDeployedAddress(address);
//       console.log("✅ Deployed at:", address);
//     } catch (err) {
//       console.error("Deployment failed:", err);
//       alert("Deployment failed: " + (err.message || String(err)));
//     } finally {
//       setIsDeploying(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: 20,
//         maxWidth: 680,
//         fontFamily: "sans-serif",
//         color: "#333",
//       }}
//     >
//       <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
//         Deploy SolarNFT Contract
//       </h2>

//       {/* --- MODIFICATION: Network status display --- */}
//       <div
//         style={{
//           marginBottom: "20px",
//           padding: "10px",
//           background: "#f0f0f0",
//           borderRadius: "4px",
//         }}
//       >
//         <strong>Connected Network: </strong>{" "}
//         {network ? network.name : "Loading..."}
//         {isWrongNetwork && (
//           <p style={{ color: "red", margin: "5px 0 0 0" }}>
//             Warning: Please switch to Sepolia or Hedera Testnet.
//           </p>
//         )}
//       </div>

//       <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
//         {/* Input fields remain the same, but placeholder is now dynamic */}
//         <input
//           style={{ padding: "8px" }}
//           placeholder="Total Kilowatts"
//           name="totalKilowatts"
//           value={form.totalKilowatts}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder="Burn Period (Years)"
//           name="burnPeriodInYears"
//           value={form.burnPeriodInYears}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder="NFT Name"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder="Symbol"
//           name="symbol"
//           value={form.symbol}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder="Base URI"
//           name="baseURI"
//           value={form.baseURI}
//           onChange={handleChange}
//         />
//         <input
//           style={{ padding: "8px" }}
//           placeholder={`Price per NFT (${network?.currency || "..."})`}
//           name="pricePerNFT"
//           value={form.pricePerNFT}
//           onChange={handleChange}
//         />

//         <button
//           onClick={deploy}
//           disabled={isDeploying || isWrongNetwork}
//           style={{
//             padding: "12px",
//             fontWeight: "700",
//             cursor: isDeploying || isWrongNetwork ? "not-allowed" : "pointer",
//             background: isDeploying || isWrongNetwork ? "#ccc" : "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//           }}
//         >
//           {isWrongNetwork
//             ? "Wrong Network"
//             : isDeploying
//             ? "Deploying..."
//             : "Deploy"}
//         </button>
//       </div>

//       {txHash && (
//         <div
//           style={{
//             marginTop: 20,
//             background: "#f8f9fa",
//             padding: "10px",
//             borderRadius: "4px",
//           }}
//         >
//           <div>
//             Tx Hash:{" "}
//             <a
//               href={`${network.explorerUrl}/tx/${txHash}`}
//               target="_blank"
//               rel="noreferrer"
//             >
//               {txHash}
//             </a>
//           </div>
//         </div>
//       )}

//       {deployedAddress && (
//         <div
//           style={{
//             marginTop: 12,
//             background: "#e9f7ef",
//             padding: "10px",
//             borderRadius: "4px",
//           }}
//         >
//           <p>
//             <b>✅ Contract deployed at:</b> {deployedAddress}
//           </p>
//           <button
//             onClick={() => navigator.clipboard.writeText(deployedAddress)}
//             style={{ padding: "6px 10px" }}
//           >
//             Copy Address
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DeployContract;



import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./DeployContract.css";

// --- MODIFICATION: Import both EVM and Hedera contract artifacts ---
// Make sure you rename your existing file to SolarNFT_EVM.json
import EvmSolarNFT from "./SolarNFT_EVM.json";
// You must provide this file after compiling your contract for Hedera
import HederaSolarNFT from "./SolarNFT_Hedera.json";

// --- MODIFICATION: Network configuration constants ---
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111
const HEDERA_TESTNET_CHAIN_ID = "0x128"; // 296

const SUPPORTED_NETWORKS = {
  [SEPOLIA_CHAIN_ID]: {
    name: "Sepolia Testnet",
    currency: "USDC",
    explorerUrl: "https://sepolia.etherscan.io",
    priceDecimals: 6,
    icon: "🔗",
    color: "#627eea",
  },
  [HEDERA_TESTNET_CHAIN_ID]: {
    name: "Hedera Testnet",
    currency: "HBAR",
    explorerUrl: "https://hashscan.io/testnet",
    priceDecimals: 8,
    icon: "🔮",
    color: "#00d4aa",
  },
};

function DeployContract() {
  // --- MODIFICATION: Add state for network awareness ---
  const [network, setNetwork] = useState(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState("idle"); // idle, deploying, success, error

  const [form, setForm] = useState({
    totalKilowatts: "1000",
    burnPeriodInYears: "1",
    name: "SolarNFT",
    symbol: "SNFT",
    baseURI: "ipfs://your-base-uri/",
    pricePerNFT: "100",
  });

  const [deployedAddress, setDeployedAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  // --- MODIFICATION: Effect to detect network on load and on change ---
  useEffect(() => {
    const handleChainChanged = () => window.location.reload();

    const checkNetwork = async () => {
      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setWalletConnected(accounts.length > 0);

        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const networkData = await provider.getNetwork();
          const chainId = `0x${networkData.chainId.toString(16)}`;

          if (SUPPORTED_NETWORKS[chainId]) {
            setNetwork(SUPPORTED_NETWORKS[chainId]);
            setIsWrongNetwork(false);
          } else {
            setNetwork({ name: "Unsupported Network", icon: "⚠️", color: "#f59e0b" });
            setIsWrongNetwork(true);
          }
        }
      } catch (error) {
        console.error("Error checking network:", error);
      }
    };

    checkNetwork();
    
    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("accountsChanged", checkNetwork);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("accountsChanged", checkNetwork);
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found. Please install MetaMask extension.");
        return;
      }
      
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletConnected(true);
      
      // Recheck network after connection
      const provider = new ethers.BrowserProvider(window.ethereum);
      const networkData = await provider.getNetwork();
      const chainId = `0x${networkData.chainId.toString(16)}`;

      if (SUPPORTED_NETWORKS[chainId]) {
        setNetwork(SUPPORTED_NETWORKS[chainId]);
        setIsWrongNetwork(false);
      } else {
        setNetwork({ name: "Unsupported Network", icon: "⚠️", color: "#f59e0b" });
        setIsWrongNetwork(true);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const simulateProgress = () => {
    setDeploymentProgress(0);
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
    return interval;
  };

  const deploy = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");

      setDeploymentStatus("deploying");
      const progressInterval = simulateProgress();

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const networkData = await provider.getNetwork();
      const chainId = `0x${networkData.chainId.toString(16)}`;

      // --- MODIFICATION: Select ABI, bytecode, and parse price based on network ---
      let contractABI, contractBytecode, pricePerNFT;

      if (chainId === SEPOLIA_CHAIN_ID) {
        contractABI = EvmSolarNFT.abi;
        contractBytecode = EvmSolarNFT.bytecode;
        pricePerNFT = ethers.parseUnits(
          form.pricePerNFT || "0",
          SUPPORTED_NETWORKS[SEPOLIA_CHAIN_ID].priceDecimals
        );
      } else if (chainId === HEDERA_TESTNET_CHAIN_ID) {
        contractABI = HederaSolarNFT.abi;
        contractBytecode = HederaSolarNFT.bytecode;
        pricePerNFT = ethers.parseUnits(
          form.pricePerNFT || "0",
          SUPPORTED_NETWORKS[HEDERA_TESTNET_CHAIN_ID].priceDecimals
        );
      } else {
        throw new Error("Cannot deploy on an unsupported network.");
      }

      if (!contractABI || !contractBytecode) {
        throw new Error(`Contract artifact for ${network.name} is missing.`);
      }

      const totalKilowatts = ethers.toBigInt(form.totalKilowatts || "0");
      const burnPeriodInYears = ethers.toBigInt(form.burnPeriodInYears || "0");
      const royaltyBps = 500n; // 5%

      setIsDeploying(true);
      setTxHash("");
      setDeployedAddress("");

      const factory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        signer
      );

      const args = [
        totalKilowatts,
        burnPeriodInYears,
        await signer.getAddress(),
        form.name,
        form.symbol,
        await signer.getAddress(),
        royaltyBps,
        await signer.getAddress(),
        form.baseURI,
        pricePerNFT,
      ];

      const overrides = { gasLimit: 8_000_000 };

      console.log(`Deploying on ${network.name} with args:`, args);

      const contract = await factory.deploy(...args, overrides);

      const tx = contract.deploymentTransaction();
      if (tx) {
        setTxHash(tx.hash);
        console.log("Deployment tx hash:", tx.hash);
      }

      await contract.waitForDeployment();

      const address = await contract.getAddress();
      setDeployedAddress(address);
      setDeploymentProgress(100);
      setDeploymentStatus("success");
      
      clearInterval(progressInterval);
      console.log("✅ Deployed at:", address);
    } catch (err) {
      console.error("Deployment failed:", err);
      setDeploymentStatus("error");
      
      if (err?.code === 4001) {
        alert("Transaction rejected by user.");
      } else if (
        err?.code === "INSUFFICIENT_FUNDS" ||
        /insufficient funds/i.test(err?.message || "")
      ) {
        alert("Insufficient funds to deploy contract. Add funds to your account.");
      } else {
        alert("Deployment failed: " + (err.message || String(err)));
      }
    } finally {
      setIsDeploying(false);
    }
  };

  const resetDeployment = () => {
    setDeploymentStatus("idle");
    setDeployedAddress("");
    setTxHash("");
    setDeploymentProgress(0);
  };

  return (
    <div className="deploy-contract-container">
      <div className="blockchain-pattern"></div>
      
      <div className="deploy-contract-form">
        <div className="form-header">
          <div className="deploy-icon">⚡</div>
          <h2>Deploy Solar NFT Contract</h2>
          <p>Launch your renewable energy smart contract on the blockchain</p>
        </div>

        {/* Wallet Connection Status */}
        {!walletConnected ? (
          <div className="wallet-connection">
            <div className="connection-card">
              <div className="wallet-icon">🦊</div>
              <h3>Connect Your Wallet</h3>
              <p>Connect MetaMask to deploy your solar NFT contract</p>
              <button className="connect-wallet-btn" onClick={connectWallet}>
                <span className="btn-icon">🔗</span>
                Connect MetaMask
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Network Status */}
            <div className={`network-status ${isWrongNetwork ? 'wrong-network' : 'correct-network'}`}>
              <div className="network-info">
                <span className="network-icon" style={{ color: network?.color }}>
                  {network?.icon || "🌐"}
                </span>
                <div className="network-details">
                  <strong>Connected Network:</strong>
                  <span className="network-name">{network ? network.name : "Loading..."}</span>
                </div>
              </div>
              {isWrongNetwork && (
                <div className="network-warning">
                  <span className="warning-icon">⚠️</span>
                  <span>Please switch to Sepolia or Hedera Testnet</span>
                </div>
              )}
            </div>

            {/* Deployment Form */}
            <div className="deployment-form">
              <div className="form-grid">
                <div className="form-section">
                  <h3>📊 Contract Parameters</h3>
                  
                  <div className="input-group">
                    <label>Total Kilowatts</label>
                    <input
                      type="number"
                      name="totalKilowatts"
                      value={form.totalKilowatts}
                      onChange={handleChange}
                      placeholder="e.g., 1000"
                    />
                  </div>

                  <div className="input-group">
                    <label>Burn Period (Years)</label>
                    <input
                      type="number"
                      name="burnPeriodInYears"
                      value={form.burnPeriodInYears}
                      onChange={handleChange}
                      placeholder="e.g., 1"
                    />
                  </div>

                  <div className="input-group">
                    <label>Price per NFT ({network?.currency || "..."})</label>
                    <input
                      type="number"
                      step="0.01"
                      name="pricePerNFT"
                      value={form.pricePerNFT}
                      onChange={handleChange}
                      placeholder={`Price in ${network?.currency || "currency"}`}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>🏷️ NFT Metadata</h3>
                  
                  <div className="input-group">
                    <label>NFT Collection Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g., SolarNFT"
                    />
                  </div>

                  <div className="input-group">
                    <label>Token Symbol</label>
                    <input
                      type="text"
                      name="symbol"
                      value={form.symbol}
                      onChange={handleChange}
                      placeholder="e.g., SNFT"
                    />
                  </div>

                  <div className="input-group">
                    <label>Base URI</label>
                    <input
                      type="text"
                      name="baseURI"
                      value={form.baseURI}
                      onChange={handleChange}
                      placeholder="ipfs://your-base-uri/"
                    />
                  </div>
                </div>
              </div>

              {/* Deployment Progress */}
              {isDeploying && (
                <div className="deployment-progress">
                  <div className="progress-header">
                    <span className="progress-icon">🚀</span>
                    <span>Deploying Contract...</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${deploymentProgress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">{Math.round(deploymentProgress)}% Complete</div>
                </div>
              )}

              {/* Deploy Button */}
              <div className="deploy-actions">
                {deploymentStatus === "success" ? (
                  <button className="reset-btn" onClick={resetDeployment}>
                    <span className="btn-icon">🔄</span>
                    Deploy Another Contract
                  </button>
                ) : (
                  <button
                    className="deploy-btn"
                    onClick={deploy}
                    disabled={isDeploying || isWrongNetwork}
                  >
                    {isWrongNetwork ? (
                      <>
                        <span className="btn-icon">⚠️</span>
                        Wrong Network
                      </>
                    ) : isDeploying ? (
                      <>
                        <div className="spinner"></div>
                        Deploying Contract...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🚀</span>
                        Deploy Solar Contract
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Transaction Hash Display */}
            {txHash && (
              <div className="transaction-info">
                <div className="tx-header">
                  <span className="tx-icon">📋</span>
                  <h3>Transaction Details</h3>
                </div>
                <div className="tx-content">
                  <div className="tx-hash">
                    <label>Transaction Hash:</label>
                    <a
                      href={`${network?.explorerUrl}/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="tx-link"
                    >
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Deployment Success */}
            {deployedAddress && (
              <div className="deployment-success">
                <div className="success-header">
                  <span className="success-icon">✅</span>
                  <h3>Contract Deployed Successfully!</h3>
                </div>
                <div className="contract-details">
                  <div className="contract-address">
                    <label>Contract Address:</label>
                    <div className="address-display">
                      <span className="address-text">{deployedAddress}</span>
                      <button
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText(deployedAddress)}
                        title="Copy address"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div className="contract-actions">
                    <a
                      href={`${network?.explorerUrl}/address/${deployedAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="view-contract-btn"
                    >
                      <span className="btn-icon">🔍</span>
                      View on Explorer
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DeployContract;