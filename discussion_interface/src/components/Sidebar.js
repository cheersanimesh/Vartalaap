import React, {useEffect, useState} from 'react'
import '../styles/Sidebar.css'
import SearchIcon from '@material-ui/icons/Search'
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined'
import { Avatar, IconButton } from '@material-ui/core'
import SidebarThread from './SidebarThread'
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined'
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined'
import SettingsIcon from '@material-ui/icons/Settings'
import db, { auth } from '../firebase'
import { useSelector } from 'react-redux'
import { selectThreadId } from '../features/counter/threadSlice'
import { selectUser } from '../features/counter/userSlice'
import { Link,Redirect} from 'react-router-dom'
import {MdAddToQueue} from 'react-icons/md'
import {RiVideoAddFill} from 'react-icons/ri'
import firebase from 'firebase'

const Sidebar = () => {

    const user = useSelector(selectUser)
    const[thread, setThreads] = useState([]);
    const threadId = useSelector(selectThreadId)
    const[meetingdetails, setMeetingDetails]= useState([]);
    useEffect(() =>{
        console.log(user)
        db.collection('threads').onSnapshot((snapshot) =>
            setThreads(snapshot.docs.map((doc) =>({
                id: doc.id,
                data: doc.data()
            })))
        )
        db.collection('meetings').onSnapshot((snapshot)=>
            setMeetingDetails(snapshot.docs.map((doc)=>({
                id: doc.id,
                data: doc.data(),
            })))
        )
    }, [])

    const addThread = () =>{
        const threadName = prompt('Enter Meeting name')
        const dateMeet= prompt('Enter date of the meeting')
        const startTime = prompt('Enter startTime :')
        const endTime= prompt('Enter endTime: ')
        const agenda= prompt('Enter agenda:')
        db.collection('threads').add({
            threadName: threadName,
        })
        db.collection('meetings').add({
            meetingName: threadName,
            date: dateMeet,
            startTime:  startTime,
            endTime: endTime,
            agenda: agenda,
            owner: user.email,
            photo: user.photo
        })
        /*
        db.collection('threads')
            .doc(threadId)
            .collection('messages')
            .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: "Agenda : \n"+agenda,
            uid: user.uid,
            photo: user.photo,
            email: user.email,
            displayName: user.displayName
        })
        */
    } 
    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
      }
    return (
        <div className = "sidebar">
            <div className = "sidebar__header">
                <div className = "sidebar__search">
                    <SearchIcon className = "sidebar__searchIcon" />
                    <input placeholder = "Search" className = "sidebar__input"/>
                </div>
                <IconButton variant = "outlined" id = "sidebar__button">
                    <MdAddToQueue onClick = {addThread}/>
                </IconButton>
                
            </div>
            <div className = "sidebar__threads">
                {console.log(meetingdetails)}
                { meetingdetails.map(({id, data: {meetingName,date,startTime,endTime,agenda,owner,photo}}) => (
                    <SidebarThread
                        key = {id}
                        id = {id}
                        threadName = {meetingName}
                        endTime={endTime}
                        date={date}
                        startTime={startTime}
                        owner= {owner}
                        photo={photo}
                    />
                ))}
            </div>
            <div className = "sidebar__bottom">
                <Avatar 
                    src = {user.photo}
                    className = "sidebar__bottom_avatar"
                    onClick = {() => auth.signOut()}
                />
                        <IconButton
                            onClick={() => openInNewTab('https://testproject2-d7052.web.app')}
                        >
                            <RiVideoAddFill 
                            />
                        </IconButton>
                <IconButton>
                    <QuestionAnswerOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SettingsIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Sidebar
