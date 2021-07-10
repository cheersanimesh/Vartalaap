import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../App.css'
import Login from './Login'
import DiscussionsPage from './DiscussionsPage';
import { login, logout, selectUser } from '../features/counter/userSlice';
import {auth} from '../firebase'
import { BrowserRouter, Route, Switch,withRouter } from "react-router-dom";
import db from '../firebase';
import VidChatTest from './vidChatTest';
import CreateRoom from './CreateRoom';
import Room from './Room';
import ContactsList from './contactsList';

function MainPage() { 

  const user = useSelector(selectUser)
  const dispatch = useDispatch();

  useEffect(() =>{
    auth.onAuthStateChanged((authUser) =>{
      if(authUser){
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          displayName: authUser.displayName,
          email: authUser.email
        }))
      } else {
        dispatch(logout())
      }
      console.log(authUser)
    })
    window.addEventListener('beforeunload',(e)=>{
      e.preventDefault();
      e.returnValue='';
    })
  },[dispatch])

  return (
  
    <>
      <div className="App">
          {user ? <DiscussionsPage /> : <Login />}
      </div>
    </>
    );
}

export default MainPage;
