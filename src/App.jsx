import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './App.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { SignedOut, SignInButton, UserButton, SignedIn } from '@clerk/clerk-react';
import { sendPushNotifications } from './utils/pushover';

//env variable
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  //initialze typing state as false
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      message: "Hi there! I am SWE-Bot.",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]); //intialze message list

  const [chatStarted, setChatStarted] = useState(false); //state to determine if user has pressed button and started chat
  
  //retrive chatHistory if any
  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) { //check if there is any
      const chatState = JSON.parse(storedChatHistory);
      setMessages(chatState.conversationHistory || []);
  }}, []);
  //handle user pressing button
  const handleStartChat = () => {
    setChatStarted(true);
  };

  //handle when a user sends a message 
  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage]; //all old messages plus new one
  
    //update message state
    setMessages(newMessages);

    //set typing indicator (simulate chatgpt typing or "thinking")
    setTyping(true);

    //send push notifcation confirming message sent
    sendPushNotifications("Message Successfully Sent!");

    //save chat history to local data
    const chatHistory = {
      conversationHistory: newMessages,
    };
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    //process message to chatGPT
    await processMessageToOpenAIAPI(newMessages);
  };

  async function processMessageToOpenAIAPI(chatMessages) {
    //change format of each message to match th requre api format: apiMessages { role: "user" or "assistant", content: "message"}
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      //check role of sender to assign correct role for OpenAI Request format
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      }
      else {
        role = "user";
      }
      return {role: role, content: messageObject.message};
    });
    //system message: how chatGPT shall respond
    const systemMessage = {
      role: "system",
      content: "a laid back AI named SWE-Bot whos happy to mentor and help anyone learning Software Engineering and Computer Science in general, but also happy to talk about whatever else."
    }
    
    //api request object
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [systemMessage,
       ...apiMessages ]//the message history
    };

    
    //fetch request to OpenAI API
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
      //convert data to json format
    }).then((data) => {
      return data.json();
    }).then((data) => {
      //find repsonse in json
      let apiReponse = data.choices[0].message.content
      //add reponse to message history
      setMessages([...chatMessages, {
        message: apiReponse,
        sender : "ChatGPT",
        direction: "incoming"
      }]);
      //ChatGPT done "typing/thinking"
      setTyping(false);
    });
  }

  //chat bot container
  return (
    <header>
      <SignedOut>
        <div className='signInPage'>
          <nav>
            <ul>
              <li><button><a href="https://github.com/argel6767/AI-ChatBot">Website Code</a></button></li>
              <li><button><a href="https://www.linkedin.com/in/argel-hernandez-amaya-2421111b1">My LinkedIn</a></button></li>
              <li><SignInButton/></li>
            </ul>
          </nav>
          <img id="SWE-Bot" src="/big_robot.png" alt="SWE-Bot" />
          <p id='SWE-Goals'>SWE-Bot is here to help your SWE and CS Needs!</p>
        </div>
      </SignedOut>
      <SignedIn>
      <div>
    {!chatStarted ? (
      <div className='buttonContainer'>
        <div style={{ textAlign: "center", position:"relative"
         }}>
        <button onClick={handleStartChat}>Start Chatting with SWE-Bot Now!</button>
      </div>
      </div>
      
    ) : (
      
      <div className="appContainer">
        <div id='userBttnContainer'>
          <UserButton id="user"/></div>
        <MainContainer id='MainContainer'>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="SWE-Bot is typing..." /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder='Type your message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    )}
  </div>
      </SignedIn>
    </header>
);
}

export default App
