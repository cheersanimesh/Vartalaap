import React from 'react';
import '../styles/chatMessages.css';

const ChatMessage = (props) => {
    const {name, message}= props.details;
    const getDate=() =>{
        var dt= new Date();
        var date = dt.toLocaleDateString();
        var time= dt.toLocaleTimeString();

        return String(time)+" "+ String(date);
    }
    return (
        <li className="chatli">
            <div className="chat-body clearfix">
                <div className="header">
                    <strong className="primary-font">{name}</strong> <small className="pull-right text-muted">
                        <span className="glyphicon glyphicon-time"></span>{getDate()}</small>
                </div>
                <p>
                    {message}
                </p>
            </div>
        </li>
    );
  };

export default ChatMessage;