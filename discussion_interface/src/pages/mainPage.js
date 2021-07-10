import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../App.css'
import Login from './Login'
import DiscussionsPage from './DiscussionsPage';
import { login, logout, selectUser } from '../features/counter/userSlice';
import {auth} from '../firebase'


function MainPage() { 

  const user = useSelector(selectUser)
  const dispatch = useDispatch();

  useEffect(() =>{

    
    auth.onAuthStateChanged((authUser) =>{
      if(authUser){             //on succesful authentication and login  dispatch the login reducer
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          displayName: authUser.displayName,
          email: authUser.email
        }))
      } else {
        dispatch(logout())           // dispatch logout reducer on logout
      }
      console.log(authUser)
    })

    // reminding the user before quiting the application
    window.addEventListener('beforeunload',(e)=>{
      e.preventDefault();
      e.returnValue='';
    })
  },[dispatch])

    //Based on whether the user is validated the respective page is loaded 
  return (
  
    <>
      <div className="App">
          {user ? <DiscussionsPage /> : <Login />} 
      </div>
    </>
    );
}

export default MainPage;
