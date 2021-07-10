import React from "react";
import { v1 as uuid } from "uuid";
import '../styles/createRoom.css'

const CreateRoom = (props) => {
    //handling the oncreate event.
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);     // routing to the link with the uuid generated
    }


    return (
        <div className="topCont">
            <button className="btn btn-info center"onClick={create}>Create room</button>
        </div>
    );
};

export default CreateRoom;
