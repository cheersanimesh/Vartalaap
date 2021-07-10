import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { Row, Col, Button } from 'react-bootstrap';
import '../styles/vidChatTest.css'
import {FaMicrophone,FaMicrophoneSlash} from 'react-icons/fa';
import {FcVideoCall,FcNoVideo} from 'react-icons/fc';
import {MdScreenShare, MdStopScreenShare} from 'react-icons/md';
import {FiSend} from 'react-icons/fi';
import ChatMessage from "../components/chatMessage";
import {IoHandRightSharp} from 'react-icons/io5';
import { DropdownButton,Dropdown } from "react-bootstrap";
import { GiVote } from "react-icons/gi"

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;
const StyledImage= styled.img`
    height: 100%;
    width: 100%;
`;
const StyledVideo = styled.video`
    height: 80%;
    width: 80%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const [userName, setUserName]= useState();
    const [message, setMessage]= useState();
    const [messages, setMessages]= useState([])
    const [peopleInRoom, setPeopleInRoom]= useState([])
    let myStream;
    const [peersState, setPeersState]= useState([])
    const peersRef = useRef([]);
    const [socketId, setSocketId]= useState()
    const [audioState, setAudioState]= useState(true);
    const [videoState, setVideoState]= useState(true);
    const [screenState, setScreenState]= useState(false);
    const [handRaised, setHandRaised]= useState(false);
    const [updated, setUpdated]= useState(false);
    const roomID = props.match.params.roomID;

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
    const handleInput=(e) =>{
        setMessage(e.target.value);
      }
    const sendMessage= () =>{
        setMessages(messages => [...messages,{name:userName, message}])
        socketRef.current.emit('chat message',{
            name:userName,
            message:message
        }
        )
        setMessage('');
    }
    const raiseHand =() =>{
        var temp = !handRaised
        setHandRaised(temp)
        if(temp)
        {
            socketRef.current.emit('hand raised',{
                name:userName
            })
        }
    }
    /*
    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({audio:true, video:true}).then(stream =>{
            if(audioState== false)
            {
                console.log('audio muted')
                var audioTr= stream.getAudioTracks();
                stream.removeTrack(audioTr[0]);
            }
            
            if(videoState == false)
            {
                console.log('video muted')
                var videoTr= stream.getVideoTracks();
                stream.removeTrack(videoTr[0]);
            }
            
            console.log('sending stream')
            userVideo.current.srcObject= stream;
        })
    },[audioState, videoState, screenState])
    */
   /*
    useEffect(() =>{
            var name= prompt('What should we call you :');
            setUserName(name);
    },[])
    */
    useEffect(() => {
        console.log('Animesh User Stream')
        socketRef.current = io.connect("https://boxing-syrup-20682.herokuapp.com");
        //socketRef.current = io.connect("http://localhost:8000")
        socketRef.current.emit('check');
        var name= prompt('What should we call you :');
        setUserName(name);
        socketRef.current.emit('new person',name);
        navigator.mediaDevices.getUserMedia({video:true, audio:true}).then(stream =>{
            try{
                userVideo.current.srcObject= stream;
                }
                catch(err){
                    console.log(err);
                }
                socketRef.current.emit("join room", roomID);
                socketRef.current.on("all users", users => {
                    const peers = [];
                    users.forEach(userID => {
                        const peer = createPeer(userID, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        })
                        peers.push(peer)
                    })
                    setPeers(peers);
                })
                socketRef.current.on("user joined", payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    })
                    setPeers(users => [...users, peer]);
                });
                socketRef.current.on('new person',(name) =>{
                    setPeopleInRoom(peopleInRoom => [...peopleInRoom,name]);
                })
                socketRef.current.on('hand raised',(msg)=>{
                    var nm = msg.name;
                    alert("Hand Raised by "+nm);
                    //var audio1 = new Audio('https://drive.google.com/file/d/1Xu3BEKK3V7cBPGfVq1CqVSL8uextmbom/view?usp=sharing');
                    //audio1.play()
                    setMessages(messages =>[...messages,msg])
                })
                socketRef.current.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });
                socketRef.current.on('chat message',(msg)=>{
                    console.log('recieved message')
                    console.log(msg)
                    setMessages(messages => [...messages,msg])
                })
                /*
                socketRef.current.on('user left',id =>{
                    const peerObj= peersRef.current.find(p=> p.peerID ===id)
                    if(peerObj){
                        peerObj.peer.destroy();
                    }
                    const peers= peersRef.current.filter(p=> p.peerID === id)
                    peersRef.current= peers;
                    setPeers(peers);
                })
                */
            });
        },[])
    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer; 
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <>
            <div className="bg-dark">
                <div class="d-flex">
                    <div class="vh-75 vw-75">
                        <div className="row">
                            <DropdownButton id="dropdown-basic-button" title="Online Users">
                                {peopleInRoom.map((name) =>{
                                <Dropdown.Item>{name}</Dropdown.Item>
                                }
                                )
                            }   
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" title="Notes">
                                <textarea rows="25" cols="40"></textarea>
                            </DropdownButton>
                        </div>
                        <div className="d-flex">
                            {peers.map((peer,index) =>{
                                return(
                                <div class="vh-80 vw-50">
                                    <Video key={index} peer={peer} />
                                </div>
                                )
                            })}
                        </div>
                    </div>
                    <div class="vh-75 vw-25">
                        <div className="chats">
                            <div className="chats_header">
                                <h1>Chats: </h1>
                            </div>
                            <div className="chats__messages">
                                <ul className="chat">
                                    {messages.map((msg) =>(
                                            <ChatMessage 
                                                details={{
                                                    name:msg.name,
                                                    message:msg.message,
                                                }}
                                            />
                                    )
                                    )}
                                </ul>
                            </div>
                                <div className="chats__input">
                                    <input type = "text" onChange={handleInput} value={message} />
                                    <Button
                                    className='bg-primary'
                                    size="sm"
                                    onClick={sendMessage}
                                    >
                                    <FiSend />
                                    </Button>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex">
                    <div class="vh-25 vw-75 d-flex">
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
                    </div>
                    <div class="vh-25 vw-25">
                    <StyledVideo ref={userVideo} autoPlay loop  muted/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Room
