import React, { useEffect, useState } from "react";
import {Line, Bar} from 'react-chartjs-2';
import { Chart } from "chart.js";

function ActivityDashboard() {
    const [chatHistory, setChatHistory] = useState([]);
    const [longestMessageSent, setLongestMessageSent] = useState("");
    const [longestMessageReceived, setLongestMessageReceived] = useState("");

    useEffect(() => {
        const chatLogs = localStorage.getItem("chatHistory"); //grabs chat logs from local storage
        if (chatLogs) {
            const parsed = JSON.parse(chatLogs); //parses data
            const history = parsed.conversationHistory || [];
            setChatHistory(history); 

            const sentMessages = history.filter(msg => msg.sender === 'user').map(msg => msg.message); //finds messages from user
            const receivedMessages = history.filter(msg => msg.sender === 'ChatGPT').map(msg => msg.message); //finds messages from ChatGPT
      
            const longestSent = sentMessages.reduce((a, b) => a.length > b.length ? a : b, ''); //finds longest message sent
            const longestReceived = receivedMessages.reduce((a, b) => a.length > b.length ? a : b, ''); //finds longest message received
      
            setLongestMessageSent(longestSent); //longest message sent by user
            setLongestMessageReceived(longestReceived); //longest message sent by ChatGPT
        }
    }, []);
    const chartData = {
        labels: chatHistory.map((_, index) => `Message ${index + 1}`),
        datasets: [
          {
            label: 'Message Lengths',
            data: chatHistory.map(msg => msg.message.length),
            borderColor: 'white',
            backgroundColor: 'white',
          } //plots data
        ]
        
      };

    
      return (
        <div>
          <h2>Activity Dashboard</h2>
          <div>
            <p><strong>Length of History:</strong> {chatHistory.length}</p>
            <p><strong>Longest Message Sent:</strong> {longestMessageSent} ({longestMessageSent.length} characters)</p>
            <p><strong>Longest Message Received:</strong> {longestMessageReceived} ({longestMessageReceived.length} characters)</p>
          </div>
          <div style={{justifyContent:"center"}}>
            <Line style={{width:"600px"}} data={chartData} />
          </div>
        </div>
    );
} 
    export default ActivityDashboard;
