import { Avatar, IconButton } from '@material-ui/core'
import  MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import React, { useEffect, useState } from 'react'
import '../styles/Thread.css'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import  MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined'
import db from '../firebase'
import firebase from 'firebase'
import { useSelector } from 'react-redux'
import { selectThreadId, selectThreadName } from '../features/counter/threadSlice'
import { selectUser } from '../features/counter/userSlice'
import Message from './Message'
import * as timeago from 'timeago.js'
import FlipMove from 'react-flip-move'
import {RiVideoAddFill} from 'react-icons/ri'

const Thread = () => {

    const[input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const threadName = useSelector(selectThreadName)
    const threadId = useSelector(selectThreadId)
    const user = useSelector(selectUser)

    useEffect(() =>{
        if(threadId){
            db
            .collection('threads')
            .doc(threadId)
            .collection('messages')
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => 
            setMessages(snapshot.docs.map((doc) =>({
                id : doc.id,
                data: doc.data()
        }))))
        }
    },[threadId])

    const sendMessage = (e) => {
            e.preventDefault();

            db.collection('threads')
            .doc(threadId)
            .collection('messages')
            .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            uid: user.uid,
            photo: user.photo,
            email: user.email,
            displayName: user.displayName
        })

        setInput('')
        
        console.log(user)
        console.log(user.id);
    }
    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }
    return (
        <div className = "thread">
            <div className = "thread__header">
                <div className = "thread__headerDetails">
                    {threadId ? (<Avatar 
                        src = {user.photo}
                    />) : (<Avatar />)}
                    
                    <div className = "thread__headerDetails_info">
                        <h4>{ threadId ? threadName : "Click on any chat Name"}</h4>
    <h5>{ threadId ? (timeago.format(messages[0]?.timestamp?.toDate())) : "last seen"}</h5>
                    </div>
                </div>
                <IconButton>
                    <MoreHorizIcon className = "thread__headerMoreHoriz"/>
                </IconButton>
            </div>
                <div className = "thread__messages">
                    <FlipMove>
                        { messages.map(({ id, data }) =>(
                        <Message key = {id} id = {id} data = {data} />
                    ))}
                    </FlipMove>
                    
                </div>
                <div className = "thread__input">
                    <form>
                    <input 
                        placeholder = "Enter a message..." 
                        type = "text" 
                        value = {input}
                        onChange = {(e) => setInput(e.target.value)}
                    /> 
                    <IconButton
                        onClick={() => openInNewTab('https://vartalaapcalling.web.app/room/'+threadId)}
                    >
                            <RiVideoAddFill />
                        </IconButton> 
                    <IconButton 
                        onClick = {sendMessage} type = "sumbit">
                            <SendRoundedIcon />
                    </IconButton>       
                    <IconButton>
                            <MicNoneOutlinedIcon />
                        </IconButton>           
                    </form>
                </div>
        </div>
    )
}

export default Thread
