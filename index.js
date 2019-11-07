const path = require('path');
const express = require('express');
const app = express();

//express
//settings
app.set('name', 'auction system');

app.set('port',process.env.PORT || 3000);

//static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname,'node_modules')));

const server = app.listen(app.get('port'), ()=>{
	console.log('serving on port ', app.get('port'));
});


const socketIO = require('socket.io');
const io = socketIO(server);


function connectToDB(id = null){
	const MongoClient = require('mongodb').MongoClient;
	const assert = require('assert');
	// Connection URL
	const url = 'mongodb://localhost:27017';
	// Database Name
	const dbName = 'AuctionDB';
	// Create a new MongoClient
	const client = new MongoClient(url);
	// Use connect method to connect to the server
	client.connect(function(err) {
	  //assert.equal(null, err);
	  //console.log("Connected correctly to server");
	 	const db = client.db(dbName);
	 	//console.log(db);
	 	if(id === null){
			getAuctionItems(db, function(){
			client.close();
	})
	 	}else{
	 		updateItem(db, function(){
	 		client.close();
	 		}, id);
	 	}

	});
}

let record = {};
function getAuctionItems(db, callback){
  // Get the documents collection
  const collection = db.collection('AuctionDB');
  collection.count({'status':'onsale'}, function(err, result){  		
        const min=1; 
	    const max=result; 
	    const randomDocId = Math.floor(Math.random() * (max - min) + min);
        console.log(randomDocId);
        const documents =
        collection.find({'status':'onsale', 'number':2}).toArray(function(err, docs) {
        //assert.equal(err, null);
	    console.log("Found the following records");
	    console.table(docs)
	    record = docs[0];
	    console.log(record);
	    callback(docs);
	    
		});

		callback(false);

  	});
}

function updateItem(db ,callback, id){
	///update...
	console.log('vendido');
  const collection = db.collection('AuctionDB');
  // Update document where a is 2, set b equal to 1
  	collection.updateOne({ number : id }
    , { $set: { status : 'sold' } }, function(err, result) {
    //assert.equal(err, null);
    //assert.equal(1, result.result.n);
    console.log("Sold item #"+id);
    callback(result);
  });
}

app.get('/getData', function(req, res, next){
	 connectToDB();
	 res.json(record);

});

app.get('/mongo', function(req, res){
	res.redirect('mongo.html');
});

app.get('/', function(req, res){
	res.redirect('index.html');
});

app.get('/admin', function(req, res){
	res.redirect('admin.html');
});

app.get('/client', function(req, res){
	res.redirect('index.html');
});

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
		});

		//update MONGODB	
		connectToDB(bid.id);
	});

	//quit auction
	socket.on('auction:quit', (bid)=>{
		 io.sockets.sockets[socket.id].disconnect();
		 io.sockets.emit('auction:quit', bid);

	});

	
});