import '../styles/Room.css'
import { useState,useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap'
import io from "socket.io-client";
import {FaMicrophone,FaMicrophoneSlash} from 'react-icons/fa';
import {FcVideoCall,FcNoVideo} from 'react-icons/fc';
import {MdScreenShare, MdStopScreenShare} from 'react-icons/md';
import {IoHandRightSharp} from 'react-icons/io5';
import { GiVote } from "react-icons/gi"

const ActionButtons = ({userName}) =>{
    const [audioState, setAudioState]= useState(true);   //to store the audioState
    const [videoState, setVideoState]= useState(true);      // to store the video state
    const [screenState, setScreenState]= useState(false);   // to store whether screen is being shared or not
    const [handRaised, setHandRaised]= useState(false);     //to store whether hand is being raised or lowered
    const socketConn= useRef()
   
   useEffect(()=>{
       socketConn.current= io.connect('https://boxing-syrup-20682.herokuapp.com')   // a new connection to enable hand raising feature

        socketConn.current.on('hand raised',(msg)=>{      // on hand raised event handler
            var nm = msg.name;
            alert("Hand Raised by "+nm);
        }) 

   },[])

        {/* handling the onclick for audio mute/unmute icon*/}
    const toggleAudio =() =>{
        const temp = !audioState
        console.log('audio toggled')  //change the audio state variable
        setAudioState(temp);
    }
    {/* handling the onclick for polling feature*/}
    const openPollingSite =() =>{
        const newWindow= window.open('https://www.poll-maker.com/','_blank', 'noopener,noreferrer')
        if (newWindow){
            newWindow.opener = null
        }
    }
    {/* handling the onclick for video mute/unmute icon*/}
    const toggleVideo= () =>{
      const temp = !videoState;
      setVideoState(temp);              //change the video state variable
      console.log('animesh 1')
    }
    {/* handling the onclick for screen share icon*/}
    const toggleScreen= () =>{
      const temp = !screenState;
      setScreenState(temp);
    }
    //enabling the raise hand feature
    const raiseHand =() =>{
        var temp = !handRaised
        setHandRaised(temp)
        if(temp)
        {
            socketConn.current.emit('hand raised',{         //emit to socket connection the hand raised
                name:userName                               // with user name
            })
        }
    }
    return(
        <div class="container m-auto">
            {/* Defining the audio mute- unmute button */}
            <Button
                className="bg-dark rounded-circle"
                onClick={toggleAudio}
                size="lg"
                >
                {audioState?<FaMicrophone size={52}/>:<FaMicrophoneSlash size={52}/>}
            </Button>
            {/* Defining the video mute- unmute button */}
            <Button
            className="bg-dark rounded-circle btn-lg"
            onClick={toggleVideo}
            size="lg"
            >
                {videoState?<FcVideoCall size={52}/>:<FcNoVideo size={52}/>}
            </Button>
            {/* Defining the screen share mute- unmute button */}
            <Button
            className="bg-dark rounded-circle outline-0"
            onClick={toggleScreen}
            size="lg"
            >
                {screenState?<MdScreenShare size={52}/>:<MdStopScreenShare size={52}/>}
            </Button>
            {/* Defining the Raise hand button */}
            <Button
            className="bg-dark rounded-circle outline-0"
            onClick={raiseHand}
            size="lg"
            >
            {handRaised?<IoHandRightSharp style={{color:'yellow'}}size={52}/>:<IoHandRightSharp size={52}/>}
            </Button>

            {/* Defining the audio polling button */}
            <Button
            className="bg-dark rounded-circle outline-0"
            size="lg"
            onClick={() => openPollingSite()}
            >
                <GiVote style={{color:'white'}} size={52} />
            </Button>
        </div>
    )

}

export default ActionButtons;