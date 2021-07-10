import React, { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import '../styles/DiscussionPage.css'
import Thread from '../components/Thread'
import db from '../firebase'
import { auth } from '../firebase'
import { selectUser } from '../features/counter/userSlice'
import { useSelector } from 'react-redux'


function DiscussionsPage() {
    const user= useSelector(selectUser)
    useEffect(() =>{
        console.log(user)
        db.collection('OnlineUsers')
        .doc(String(user.email))
        .set({
            displayName: user.displayName,
            email: user.email,
            pic: user.photo,
        })
        window.addEventListener('beforeunload',(e)=>{
            db.collection('OnlineUsers')
            .doc(String(user.email))
            .delete()
          })
    })
    
    return (
        <div className = "discussion_page">
            <Sidebar />
            <Thread />
        </div>
    )
}

export default DiscussionsPage
