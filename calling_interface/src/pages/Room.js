import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import '../styles/Room.css'
import StyledVideo from "../components/StyledVideo";
import ActionButtons from "../components/ActionButtons";
import ChatArea from "../components/chatArea";
import MenuDrop from "../components/MenuDrop";
import PeerVideos from "../components/peerVideos";

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const [userName, setUserName]= useState();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;

    useEffect(() => {
        console.log('Animesh User Stream')
        socketRef.current = io.connect("https://boxing-syrup-20682.herokuapp.com");
        //socketRef.current = io.connect("http://localhost:8000")
        socketRef.current.emit('check');
        var name= prompt('What should we call you :');
        setUserName(name);
        navigator.mediaDevices.getUserMedia({video:videoConstraints, audio:true}).then(stream =>{
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
                socketRef.current.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });
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
                        <MenuDrop />
                    </div>
                        <PeerVideos 
                            peers={peers}
                        />
                    </div>
                    <div class="vh-75 vw-25">
                        <ChatArea 
                        userName={userName}
                        />
                    </div>
                </div>
                <div class="d-flex">
                    <div class="vh-25 vw-75 d-flex">
                        <ActionButtons 
                            userName= {userName}
                         />
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