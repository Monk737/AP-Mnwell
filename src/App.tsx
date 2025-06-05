import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import LeveragedYieldFarmABI from '../artifacts/contracts/LeveragedYieldFarm.sol/LeveragedYieldFarm.json';

function App() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [rewards, setRewards] = useState(null);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast.error('Please install MetaMask!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setConnected(true);

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual address
      const farmContract = new ethers.Contract(contractAddress, LeveragedYieldFarmABI.abi, signer);
      setContract(farmContract);
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect wallet');
    }
  };

  const deposit = async () => {
    try {
      setLoading(true);
      const tx = await contract.deposit(ethers.parseUnits(amount, 6));
      await tx.wait();
      toast.success('Deposit successful!');
    } catch (error) {
      console.error(error);
      toast.error('Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async () => {
    try {
      setLoading(true);
      const tx = await contract.withdraw(ethers.parseUnits(amount, 6));
      await tx.wait();
      toast.success('Withdrawal successful!');
    } catch (error) {
      console.error(error);
      toast.error('Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const checkRewards = async () => {
    try {
      const rewards = await contract.getOutstandingRewards();
      setRewards(rewards);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch rewards');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-[#40E0D0] to-[#FF69B4] p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Leveraged Yield Farm</h1>
          <button
            onClick={connectWallet}
            className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            {connected ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Input Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Amount (USDC)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40E0D0]"
                placeholder="Enter amount"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={deposit}
                disabled={loading || !connected}
                className="flex-1 bg-black text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Deposit'}
              </button>
              <button
                onClick={withdraw}
                disabled={loading || !connected}
                className="flex-1 bg-black text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Your Rewards</h2>
            <button
              onClick={checkRewards}
              disabled={!connected}
              className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 mb-4"
            >
              Check Rewards
            </button>
            
            {rewards && (
              <div className="p-4 bg-gradient-to-r from-[#40E0D0]/10 to-[#FF69B4]/10 rounded-lg">
                <p className="text-gray-700">
                  WELL Tokens: {ethers.formatUnits(rewards[0]?.totalAmount || 0, 18)}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;