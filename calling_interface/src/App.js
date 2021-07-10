import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch,withRouter } from "react-router-dom";
import Room from './pages/Room';
import JoinCreate from './pages/JoinCreate';
import 'semantic-ui-css/semantic.min.css'
import CreateRoom from './pages/CreateRoom';
import VidChatTest from './pages/vidChatTest';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/VidChatTest' component={VidChatTest} />
        <Route path ='/createRoom' component={CreateRoom} />
        <Route path='/room/:roomID' component={Room} />
        <Route path='/' component= {() => {
          return(
          <div className="main"> 
            <JoinCreate />
          </div>
          );
          }} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
