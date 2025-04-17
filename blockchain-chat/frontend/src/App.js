import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import ChatABI from "./ChatABI.json";
import "./App.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [contract, setContract] = useState(null);

  const requestAccount = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      alert("Install MetaMask to use this DApp");
    }
  };

  const loadContract = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const chatContract = new Contract(CONTRACT_ADDRESS, ChatABI, signer);
      setContract(chatContract);
    }
  };

  const sendMessage = async () => {
    if (!contract || message.trim() === "") return;
    try {
      const tx = await contract.sendMessage(message);
      await tx.wait();
      setMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const fetchMessages = async () => {
    if (!contract) return;
    try {
      const data = await contract.getAllMessages();
      const formatted = data.map((msg, index) => ({
        id: index,
        sender: msg.sender,
        content: msg.text,
        timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
      }));
      setMessages(formatted.reverse()); // latest at top
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (account) {
      loadContract();
    }
  }, [account]);

  useEffect(() => {
    if (contract) {
      fetchMessages();
    }
  }, [contract]);

  return (
    <div className="app-container">
      <h1 className="title">Blockchain Chat</h1>

      <div className="wallet-connect">
        <button className="connect-button" onClick={requestAccount}>
          {account
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>

      <div className="chat-box">
        {messages.length === 0 && <p>No messages yet.</p>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender === account ? "sent" : "received"
            }`}
          >
            <div className="msg-header">
              <span className="msg-sender">
                {msg.sender.slice(0, 6)}...{msg.sender.slice(-4)}
              </span>
              <span className="msg-time">{msg.timestamp}</span>
            </div>
            <span className="msg-content">{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          className="message-input"
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
