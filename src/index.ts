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
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', (data) => {
        console.log(data);
    });
});