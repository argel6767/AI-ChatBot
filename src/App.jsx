import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './App.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hi there! I am ChatGPT",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage]; //all old messages plus new one
  
    //update message state
    setMessages(newMessages);
    //process message to chatGPT
  };
  return (
      <div className='App'>
        <div style={{ position: "relative", height:"700px", width:"700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {messages.map((message, i) => {
                return <Message key={i} model = {message}/>
              })}
            </MessageList>
            <MessageInput placeholder='Type your message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
        </div>
       
      </div>
      
    
  )
}

export default App
