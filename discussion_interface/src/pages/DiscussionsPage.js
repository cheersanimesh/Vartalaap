import React from 'react'
import Sidebar from '../components/Sidebar'
import '../styles/DiscussionPage.css'
import Thread from '../components/Thread'


function DiscussionsPage() {

    
    return (
        <div className = "discussion_page">
            <Sidebar />
            <Thread />
        </div>
    )
}

export default DiscussionsPage
