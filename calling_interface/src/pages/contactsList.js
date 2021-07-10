import React, { useEffect,useState } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom';
import '../styles/contactsList.css'

const ContactsList = (props) =>{

    function joinCall (){
      var roomId= prompt('enter room id')
      const newWindow = window.open(roomId, '_blank', 'noopener,noreferrer')
      if(newWindow)
      {
        newWindow.opener(null);
      }
    }
    return(
    <div className="center" >
        <Link to='/createRoom'>
          <button className="ui button green" >Create Meeting</button>
        </Link>
          <button className="ui button yellow" onClick={joinCall}>Join Meeting</button>
    </div>
    );
}

export default ContactsList;