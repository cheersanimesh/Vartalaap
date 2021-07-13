import { Avatar } from '@material-ui/core'
import React, { forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/counter/userSlice'
import '../styles/Message.css'

const Message = forwardRef(({
    id, data: {
            timestamp,
            displayName,
            email,
            message,
            photo,
            uid
    }
}, ref) => {

    const user = useSelector(selectUser)     // selecting the authenticated used from the redux store

    return (
        <div ref = {ref} className = {`message ${user.email === email && `message__sender`}`}
        
            >
                {/* Displaying the photo of the User posting the message*/}
                <Avatar
                    src = {photo} 
                    className = "message__photo"       
                />
                {/* Displaying the contents of the message */}
                <div className = "message__contents">
                    <p className = "message__content">{message}</p>

                    
                    <small className = "message__timestamp">{new Date(timestamp?.toDate()).toLocaleString()}</small>
                </div>
            
        </div>
    )
})

export default Message
