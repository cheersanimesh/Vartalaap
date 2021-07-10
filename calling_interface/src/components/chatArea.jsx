import { useEffect, useState,useRef } from "react";
import ChatMessage from "./chatMessage";
import io from "socket.io-client";
import { Button } from "react-bootstrap";
import { FiSend } from "react-icons/fi";
import '../styles/Room.css'

const ChatArea = ({userName}) =>{
    const [message, setMessage]= useState();
    const [messages, setMessages]= useState([])
    const socketRef = useRef();
    
    useEffect(()=>{
        socketRef.current= io.connect("https://boxing-syrup-20682.herokuapp.com")
        socketRef.current.on('chat message',(msg)=>{
            console.log('recieved message')
            console.log(msg)
            setMessages(messages => [...messages,msg])
        })
    },[])
    const handleInput=(e) =>{
        setMessage(e.target.value);
    }
    const sendMessage= () =>{
        setMessages(messages => [...messages,{name:userName, message}])
        socketRef.current.emit('chat message',{
            name:userName,
            message:message
        }
        )
        setMessage('');
    }
    return(
        <div className="chats">
            <div className="chats_header">
                <h1>Chats: </h1>
            </div>
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