import { useEffect, useState,useRef } from "react";
import ChatMessage from "./chatMessage";
import io from "socket.io-client";
import { Button } from "react-bootstrap";
import { FiSend } from "react-icons/fi";
import '../styles/Room.css'

const ChatArea = ({userName}) =>{
    const [message, setMessage]= useState();            // to store the chat message being entered
    const [messages, setMessages]= useState([])         // to store the messages
    const socketConn = useRef();                            
    
    useEffect(()=>{
        socketConn.current= io.connect("https://boxing-syrup-20682.herokuapp.com")   // a new connection to pass message between clients
        
        socketConn.current.on('chat message',(msg)=>{        // handling on chat message recieved event
            console.log('recieved message')
            console.log(msg)
            setMessages(messages => [...messages,msg])
        })

    },[])
    const handleInput=(e) =>{
        setMessage(e.target.value);      // Handling on Change of value in the input field
    }

    const sendMessage= () =>{
        // emits the message to other clients through socket channel and also appends the message
         // to message list
        setMessages(messages => [...messages,{name:userName, message}])
        socketConn.current.emit('chat message',{
            name:userName,
            message:message
        }
        )
        setMessage('');
    }
    return(
        <div className="chats">
            {/* Heading for chats element */}
            <div className="chats_header">
                <h1>Chats: </h1>        
            </div>
            {/* Displaying the Chats as a list */}
            <div className="chats__messages">
                <ul className="chat">
                    {messages.map((msg) =>(
                            <ChatMessage 
                                details={{
                                    name:msg.name,
                                    message:msg.message,
                                }}
                            />
                    )
                    )}
                </ul>
            </div>
            {/* The input and the submit area*/}
                <div className="chats__input">
                    <input type = "text" onChange={handleInput} value={message} />
                        <Button
                        className='bg-primary'
                        size="sm"
                        onClick={sendMessage}
                        >
                            <FiSend />
                        </Button>
                </div>
        </div>

    )
}
export default ChatArea;