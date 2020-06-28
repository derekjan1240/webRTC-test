import app from "./App";
import socketIO  from "socket.io";
import dotenv from "dotenv";
// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;
const server = app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at ${ port }` );
} );

// Socket setup
const io = socketIO.listen(server);

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    socket.on('sdp', (data) => {
        "use strict";
        // console.log(data);
        console.log('handle sdp!')
        socket.broadcast.emit('msg', data);
    });

    socket.on('candidate', (data) => {
        "use strict";
        // console.log(data);
        console.log('handle candidate!')
        socket.broadcast.emit('msg', data);
    });

    // gameRoom
    socket.on('findRoom', (data)=>{
        io.of('/').in(data.roomName).clients((error: any, clients: string | any[]) => {
            if (error) throw error;
            if (clients.length === 1) {
                socket.emit('isRoomExist', { result: true, msg: '加入房間!', room: data.roomName, user: data.userName });
            } else if (clients.length > 1) {
                socket.emit('isRoomExist', { result: false, msg: '房間已滿!' });
            } else {
                // socket.emit('isRoomExist', { result: false, msg: '找不到你說的房間哦!' });
                socket.emit('autoCreateRoom', { result: true, msg: '自動生成房間!', room: data.roomName, user: data.userName });
            }
        })
    });

    socket.on('joinRoom', (data) => {
        io.of('/').in(data.roomName).clients((error: any, clients: string | any[]) => {
            if (error) throw error;
            if (clients.length < 2) {
                console.log(clients.length, data.roomName);
                socket.join(data.roomName);

                // test room msg
                socket.in(data.roomName).broadcast.emit('test', { msg: 'room msg test', clientData: data });


            } else {
                // The room is full
                socket.emit('isRoomExist', { result: false, msg: '房間已滿!' });
            }
        });
    });
});

const room = io.of('/WebRTC/:roomID');
room.on('connection', (socket) => {
  console.log('someone connected to room', socket);
});