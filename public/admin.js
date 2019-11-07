const socket = io();

let bidField = document.getElementById('bid');
let accceptBid = document.getElementById('accept');
let output = document.getElementById('output');
let client = document.getElementById('client');
let itemId = document.getElementById('itemid');

accceptBid.addEventListener('click', ()=>{
	const bid = bidField.value.trim();
	const usr = client.value.trim();
	const id = itemId.value.trim();
	
	socket.emit('bid:accept', {
		quantity: bid,
		client: usr,
		id: id
	});

 	Swal.fire({
      title: 'Auction closed...',
	  text: 'SOLD for '+bid+ ' to '+usr,
	  confirmButtonColor: '#3085d6',
	  confirmButtonText: 'Ok!'
	});
	
})

socket.on('bid:receive', (bid)=>{
	bidField.value = '$'+bid.quantity;
	output.innerHTML += '<p><strong>$'+bid.quantity+' by '+bid.client+'</strong></p>';
	client.value = bid.client;
	itemId.value = bid.id;

});

socket.on('auction:quit', (bid)=>{
	output.innerHTML += '<p><strong>'+bid.client+' quit</strong></p>';
})

