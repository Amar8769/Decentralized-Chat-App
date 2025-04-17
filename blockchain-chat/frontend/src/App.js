import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const requestAccount = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  const handleSendMessage = () => {
    if (!account) {
      alert("Connect your wallet first");
      return;
    }
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      sender: account,
      content: message,
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

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
        {messages.map((msg) => (
          <div key={msg.id} className="message sent">
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
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
