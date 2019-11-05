const path = require('path');
const express = require('express');
const app = express();

//express
//settings
app.set('name', 'auction system');

app.set('port',process.env.PORT || 3000);

//static files
app.use(express.static(path.join(__dirname, 'public')));


const server = app.listen(app.get('port'), ()=>{
	console.log('serving on port ', app.get('port'));
});


const socketIO = require('socket.io');
const io = socketIO(server);

///web sockets
io.on('connection', (socket)=>{
	console.log('new connection', socket.id);
	socket.emit('welcome', 'hi');

	socket.on('bid:send', (bid)=>{
		console.log(bid);
		io.sockets.emit('bid:receive', bid);
	});


	//close the auction
	socket.on('bid:accept', (bid)=>{
		console.log('accepted');
		io.sockets.emit('auction:closed', bid);
		const currentSockets = io.sockets.sockets;
		const aCurrentSockets =Object.keys(currentSockets);
		console.log(aCurrentSockets);

		aCurrentSockets.forEach((id)=>{
			currentSockets[id].disconnect(true);
		})	
	});

	//quit auction
	socket.on('auction:quit', (bid)=>{
		 io.sockets.sockets[socket.id].disconnect();
		 io.sockets.emit('auction:quit', bid);

	});

	
});