import React, {useEffect, useState} from 'react'
import '../styles/Sidebar.css'
import SearchIcon from '@material-ui/icons/Search'
import { Avatar, IconButton } from '@material-ui/core'
import SidebarThread from './SidebarThread'
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined'
import SettingsIcon from '@material-ui/icons/Settings'
import db, { auth } from '../firebase'
import { useSelector } from 'react-redux'
import { selectThreadId } from '../features/counter/threadSlice'
import { selectUser } from '../features/counter/userSlice'
import {MdAddToQueue} from 'react-icons/md'
import {RiVideoAddFill} from 'react-icons/ri'
import { Modal,Button } from 'react-bootstrap';
import {IoIosPeople} from 'react-icons/io';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import "react-datepicker/dist/react-datepicker.css";
import emailjs from 'emailjs-com';

const Sidebar = () => {

    const user = useSelector(selectUser)        // selecting the user from redux store
    const[thread, setThreads] = useState([]);
    const threadId = useSelector(selectThreadId)   
    const[meetingdetails, setMeetingDetails]= useState([]);   // for storing themeeting details
    const[showModal, setShowModal]= useState(false);         //for modal state
    const[threadName, setThreadName]= useState();            // name of any meeting/thread created
    const[dateMeet, setDateMeet]= useState(new Date());    // the new date assigned
    const[startTime, setStartTime]= useState('12:00');    // for storing the start time
    const[endTime, setEndTime]= useState('12:00');        // for storing the end time
    const[agenda, setAgenda]= useState();                   // for storing the agenda
    const[emailsRecipients, setEmailRecipients]= useState()  // for storing the recipients of email

     //handlers for on their respective onChange events
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleThreadName= (e) =>{
        setThreadName(e.target.value)
    }
    const handleAgenda= (e) =>{
        setAgenda(e.target.value)
    }
    const handleEmailsRecipients =(e) =>{
        setEmailRecipients(e.target.value)
    }

    // quering firestore db for threads and meetings
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

    // shortening the date
    const getShortendDate= () =>{
        var convertedStartDate = new Date(dateMeet);
        var month = convertedStartDate.getMonth() + 1
        var day = convertedStartDate.getDay();
        var year = convertedStartDate.getFullYear();
        var shortStartDate = month + "/" + day + "/" + year;
        return shortStartDate;
    }

    // function to start a new meeting/ thread
    const addThread = () =>{
        db.collection('threads').add({    
            threadName: threadName,
        })
        db.collection('meetings').add({
            meetingName: threadName,
            date: getShortendDate(),
            startTime:  startTime,
            endTime: endTime,
            agenda: agenda,
            owner: user.email,
            photo: user.photo
        })
        const stringArr= emailsRecipients.split(';');

        stringArr.map((email) =>{
            sendEmail(email)
        })
        setThreadName('')
        setMeetingDetails([])
        setStartTime('')
        setEndTime('')
        setAgenda('')
        setShowModal(false)
    } 

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
      }
    
    //sending email using email js api
    function sendEmail(email) {
        const mailParam= {      // passing relevant details to the mail api for sending emails
            email_to_send: email,
            meeting_name: threadName,
            meeting_owner: user.displayName,
            meeting_date: getShortendDate(),
            start_time: startTime.toString(),
            end_time: endTime.toString(),
            meeting_agenda: agenda,
        }
        emailjs.send('service_4rqnkql', 'template_uvo8ypo', mailParam,'user_BqxAtqfacSrjZtke1kcWQ')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
    } 

    return (
        <div className = "sidebar">

            {/* Header of the sidebar */}
            <div className = "sidebar__header">
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title><IoIosPeople size={52}/>Create Meeting</Modal.Title>
                    </Modal.Header>

                    {/* Modal for accepting form inputs */}
                    <Modal.Body>
                        <h3>Meeting Name: <input type = "text" onChange={handleThreadName} value={threadName} /></h3>
                        <h3>Date : <DatePicker selected={dateMeet} onChange={(date) =>setDateMeet(date)} /></h3>
                        {/* <h3>Date of Meeting: <input type = "text" onChange={handleDateMeet} value={dateMeet} /></h3> */}
                        <h3>Start Time: <TimePicker onChange={(time) => setStartTime(time)} value={startTime} /></h3>
                        {/*<h3>Start Time: <input type = "text" onChange={handleStartTime} value={startTime} /></h3> */}
                        <h3>End Time: <TimePicker onChange={(time) => setEndTime(time)} value={endTime} /></h3>
                        {/* <h3>End Time: <input type = "text" onChange={handleEndTime} value={endTime} /></h3> */}
                        <h3>Agenda: <input type = "text" onChange={handleAgenda} value={agenda} /></h3>
                        <h3>Enter Email of Recipients : <input type = "text" onChange={handleEmailsRecipients} value={emailsRecipients} /></h3>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={addThread}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className = "sidebar__search">
                    <SearchIcon className = "sidebar__searchIcon" />
                    <input placeholder = "Search" className = "sidebar__input"/>
                </div>
                <IconButton variant = "outlined" id = "sidebar__button">
                    <MdAddToQueue onClick ={handleShow}/>
                </IconButton>
            </div>

            {/* main body displaying all the threads */}
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
            {/* bottom of the sidebar containing the icons */}
            <div className = "sidebar__bottom">
                <Avatar 
                    src = {user.photo}
                    className = "sidebar__bottom_avatar"
                    onClick = {() => auth.signOut()}
                />
                        <IconButton
                            onClick={() => openInNewTab('https://vartalaapcalling.web.app')}
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
