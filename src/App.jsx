import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './App.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";

//env variable
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  //initialze typing state as false
  const [typing, setTyping] = useState(false);


  const [messages, setMessages] = useState([
    {
      message: "Hi there! I am ChatGPT",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]); //intialze message list

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

    //process message to chatGPT
    await processMessageToOpenAIAPI(newMessages);
  };

  async function processMessageToOpenAIAPI(chatMessages) {
    //chatMessages { sender: "user" or "ChatGPT", message: "message"}

    //apiMessages { role: "user" or "assistant", content: "message"}

    //change format of each message to match th requre api format
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
      content: "Someone trying too hard to be cool."
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
      <div className='App'>
        <div style={{ position: "relative", height:"700px", width:"700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
            scrollBehavior='smooth'
             typingIndicator= {typing? <TypingIndicator content="ChatGPT is typing..."/> : null}
            >
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
