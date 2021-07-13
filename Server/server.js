require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
//const socket = require("socket.io");
const io = require("socket.io")(server,{
    allowEIO3: true,
    cors:{
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const users = {};

const socketToRoom = {};

io.on('connection', socket => {

    console.log('user connected '+ Date())  // only for debugging purpose to check whether the user joined

    socket.on('check',() =>{           
        console.log('check fired')          // only for debugging purposes
    })


    // listening for join room event which is fired when a new user joins a room
    socket.on("join room", roomID => {

        console.log('join Room fired');         

        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 7) {           // limiting the number of people who can be a part of the meet
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);     // push the user to the room 
        } else {
            users[roomID] = [socket.id];       // create a new room
        }
        socketToRoom[socket.id] = roomID;      // mapping from socket id to room id    
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);  // picking all clients in the room except self

        socket.emit("all users", usersInThisRoom);    // pass  the users in the given room from server to client
    });

    // listening for a chat message event
    socket.on('chat message',(msg)=>{
        console.log('chat message '+ msg);
        console.log(msg.message); 
        socket.broadcast.emit('chat message', msg);   // broadcast the message to all the connected clients 
    })

    //listening for the hand raised event
    socket.on('hand raised',(msg)=>{
        console.log('hand raised fired')
        console.log(msg.name)
        const str= msg+" has raised hand"
        socket.broadcast.emit('hand raised',{
            name: msg.name,
            message: str
        })
    })

    // sending the joining signal recieved from one client to another
    socket.on("sending signal", payload => {
        console.log('sending signal fired')   
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    // sending back signal from one client to another 
    socket.on("returning signal", payload => {
        console.log('returning signal fired')
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    // on disconnect of the client
    socket.on('disconnect', () => {
        console.log('disconnect fired')
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
        //socket.broadcast.emit('user left', socket.id)
    });

});

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));
