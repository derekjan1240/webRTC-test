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
});