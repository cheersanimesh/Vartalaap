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
    const [audioState, setAudioState]= useState(true);
    const [videoState, setVideoState]= useState(true);
    const [screenState, setScreenState]= useState(false);
    const [handRaised, setHandRaised]= useState(false);
    const socketRef2= useRef()
    /*
    useEffect(()=>{
        socketRef.current.on('hand raised',(msg)=>{
            var nm = msg.name;
            alert("Hand Raised by "+nm);
        })
    })
    */
   useEffect(()=>{
       socketRef2.current= io.connect('https://boxing-syrup-20682.herokuapp.com')
        socketRef2.current.on('hand raised',(msg)=>{
            var nm = msg.name;
            alert("Hand Raised by "+nm);
        }) 
   },[])

    const toggleAudio =() =>{
        const temp = !audioState
        console.log('audio toggled')
        setAudioState(temp);
    }
    const openPollingSite =() =>{
        const newWindow= window.open('https://www.poll-maker.com/','_blank', 'noopener,noreferrer')
        if (newWindow){
            newWindow.opener = null
        }
    }
    const toggleVideo= () =>{
      const temp = !videoState;
      setVideoState(temp);
      console.log('animesh 1')
    }
    const toggleScreen= () =>{
      const temp = !screenState;
      setScreenState(temp);
    }
    const raiseHand =() =>{
        var temp = !handRaised
        setHandRaised(temp)
        if(temp)
        {
            socketRef2.current.emit('hand raised',{
                name:userName
            })
        }
    }
    return(
        <div class="container m-auto">
            <Button
                className="bg-dark rounded-circle"
                onClick={toggleAudio}
                size="lg"
                >
                {audioState?<FaMicrophone size={52}/>:<FaMicrophoneSlash size={52}/>}
            </Button>
            <Button
            className="bg-dark rounded-circle btn-lg"
            onClick={toggleVideo}
            size="lg"
            >
                {videoState?<FcVideoCall size={52}/>:<FcNoVideo size={52}/>}
            </Button>
            <Button
            className="bg-dark rounded-circle outline-0"
            onClick={toggleScreen}
            size="lg"
            >
                {screenState?<MdScreenShare size={52}/>:<MdStopScreenShare size={52}/>}
            </Button>
            <Button
            className="bg-dark rounded-circle outline-0"
            onClick={raiseHand}
            size="lg"
            >
            {handRaised?<IoHandRightSharp style={{color:'yellow'}}size={52}/>:<IoHandRightSharp size={52}/>}
            </Button>

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