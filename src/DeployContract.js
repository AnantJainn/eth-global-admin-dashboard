import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./DeployContract.dark.css";
import { uploadToFilecoin } from "./uploadToFilecoin";
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
  const [imageLink, setimageLink] = useState("");
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

      console.log(form.baseURI);
      const baseURI = form.baseURI 
        ? await uploadToFilecoin(form.baseURI) 
        : "";
      setimageLink(baseURI);

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
        baseURI,
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
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, baseURI: e.target.files[0] })}
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
            {deployedAddress && (
              <div className="deployment-success">
                <div className="success-header">
                  <span className="success-icon">✅</span>
                  <h3>Filecoin base URI</h3>
                </div>
                <div className="contract-details">
                  <div className="contract-address">
                    <label>Filecoin base URI :</label>
                    <div className="address-display">
                      <span className="address-text">{imageLink}</span>
                      <button
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText(imageLink)}
                        title="Copy address"
                      >
                        📋
                      </button>
                    </div>
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
