import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import '../styles/SidebarThread.css'
import db from '../firebase'
import { setThread } from '../features/counter/threadSlice'

const SidebarThread = ({ id, threadName,date,endTime,startTime,agenda,owner,photo}) => {

    const dispatch = useDispatch();
    const [threadInfo, setThreadInfo] = useState([])
    const [threadInfo2, setThreadInfo2]= useState([])
    
    useEffect(() => {
        db.collection('threads')
            .doc(id)
            .collection('messages')
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => 
                setThreadInfo(snapshot.docs.map((doc) => doc.data()))
            )
    },[id])
   

    return (
        <div 
            className = "sidebarThread"
            onClick = {() => 
                dispatch(setThread({
                    threadId: id,
                    threadName: threadName
                }))
            }    
        >
            <Avatar 
                src = {photo} />
            <div className = "sidebarThread__details">
            <h3>{threadName}</h3>
                <p> Organiser : {owner}</p>
                <p>On {date} From {startTime} to {endTime}</p>
            </div>
        </div>
    )
}

export default SidebarThread
