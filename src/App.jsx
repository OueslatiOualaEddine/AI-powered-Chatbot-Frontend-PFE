import { useState } from 'react'
import ChatbotIcon from './components/ChatbotIcon.jsx'
import ChatForm from './components/ChatForm.jsx'
import ChatMessage from './components/ChatMessage.jsx'
import './App.css'

const App = () => {

  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const generateBotResponce = async (history) => {
    // Helper function to update
    const updateHistory = (text) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text!== "Just a Sec ..."), { role: "model", text }]);
    }
    
    const formattedHistory = history.map(({role, text}) => ({role, parts: [{text}]}));

    // Make the API call to get the bot' s response
    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json",},
        body: JSON.stringify({ message: formattedHistory }),
      });

      const data = await response.json();
      
      // Clean and update chat hi story with bot' s response
      const apiResponseText = data.reply.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    }
    catch (error) {
    console. log(error);
    }
  };

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-outlined">robot_2</span>
        <span className="material-symbols-sharp">close</span> 
      </button>

      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text"> Chatbot </h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)}
          class="material-symbols-sharp">keyboard_arrow_down</button>          
        </div>

        {/* Chatbot Body */}
        <div className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text"> Hey there 👋 <br/> Questy is Here ! <br/> Your Virtual Assistant <br/> How can I help you today ? </p>
          </div>

          {chatHistory.map((chat, index)  => (
            <ChatMessage key={index} chat={chat} />
          ))}

        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponce={generateBotResponce} />
        </div>
      </div>
    </div>
  )
}

export default App
