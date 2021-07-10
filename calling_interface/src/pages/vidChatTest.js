import { Container, Row, Col, Button } from 'react-bootstrap';
import vid from '../videos/vid1.mov';
import styled from "styled-components";
import { useEffect, useRef,useState } from 'react';
import {FaMicrophone,FaMicrophoneSlash} from 'react-icons/fa';
import {FcVideoCall,FcNoVideo} from 'react-icons/fc';
import {MdScreenShare, MdStopScreenShare} from 'react-icons/md';
import {FiSend} from 'react-icons/fi';
import {IoHandRightSharp} from 'react-icons/io5';
import '../styles/Room.css'
import { DropdownButton,Dropdown } from 'react-bootstrap'; 

const StyledVideo = styled.video`
    height: 80%;
    width: 80%;
`;
const StyledImage= styled.img`
    height: 100%;
    width: 100%;
`;
function VidChatTest() {
  const userVideo= useRef();
  const [messages, setMessages]= useState([])
  const [message, setMessage]= useState();
  const [audioState, setAudioState]= useState(true);
  const [videoState, setVideoState]= useState(true);
  const [screenState, setScreenState]= useState(false);

  const toggleAudio= () =>{
      const temp = !audioState;
      setAudioState(temp);
  }

  const toggleVideo= () =>{
    const temp = !videoState;
    setVideoState(temp);
  }
  const toggleScreen= () =>{
    const temp = !screenState;
    setScreenState(temp);
  }
  const sendMessage= () =>{
      console.log(message);
      setMessages(messages => [...messages,message])
      setMessage('');
  }
  const handleInput=(e) =>{
    setMessage(e.target.value);
  }

  useEffect(() =>{
    if(videoState || audioState){
        console.log(videoState);
        console.log(audioState);
    }
  })

  return (
    <div className="bg-dark">
    <div class="d-flex">
        <div class="vh-75 vw-75">
          <div className="row">
            <DropdownButton id="dropdown-basic-button" title="Online Users">
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="Notes">
              <textarea rows="25" cols="40"></textarea>
            </DropdownButton>
          </div>
          
          <div class="d-flex">
            <div class="vh-80 vw-50">
              <StyledVideo src={vid} autoPlay loop muted />
            </div>
            
          </div>
        </div>
        <div class="vh-75 vw-25">
          <div className="chats">
            <div className="chats__header">
              <h1>Chats: </h1>
            </div>
            <div className="chats__messages">
              <div className="container">
                <ul>
                  {messages.map((msg) =>(
                      <div>
                        <l1>{msg}</l1>
                      </div>
                    )
                  )}
                </ul>
                </div>
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
                  {audioState?<FaMicrophone size={70}/>:<FaMicrophoneSlash size={70}/>}
                </Button>
                <Button
                  className="bg-dark rounded-circle btn-lg"
                  onClick={toggleVideo}
                  size="lg"
                >
                  {videoState?<FcVideoCall size={70}/>:<FcNoVideo size={70}/>}
                </Button>
                <Button
                  className="bg-dark rounded-circle outline-0"
                  onClick={toggleScreen}
                  size="lg"
                >
                  {screenState?<MdScreenShare size={70}/>:<MdStopScreenShare size={70}/>}
                </Button>
                <Button
                  className="bg-dark rounded-circle outline-0"
                  onClick={toggleScreen}
                  size="lg"
                >
                  {screenState?<IoHandRightSharp style={{color:'yellow'}}size={70}/>:<IoHandRightSharp size={70}/>}
                </Button>
            </div>
        </div>
        <div class="vh-25 vw-25">
          
        </div>
    </div>
    </div>
  );
}

export default VidChatTest;
