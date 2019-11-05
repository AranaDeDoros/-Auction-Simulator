const socket = io();

let bidField = document.getElementById('bid');
let accceptBid = document.getElementById('accept');
let output = document.getElementById('output');
let client = document.getElementById('client');

accceptBid.addEventListener('click', ()=>{
	const bid = bidField.value.trim();
	const usr = client.value.trim();
	
	socket.emit('bid:accept', {
		quantity: bid,
		client: usr
	});

 	Swal.fire({
      title: 'Auction closed...',
	  text: 'Item SOLD for '+bid+ ' to '+usr,
	  confirmButtonColor: '#3085d6',
	  confirmButtonText: 'Ok!'
	});
	
})

socket.on('bid:receive', (bid)=>{
	bidField.value = '$'+bid.quantity;
	output.innerHTML += '<p><strong>$'+bid.quantity+' by '+bid.client+'</strong></p>';
	client.value = bid.client;

});

socket.on('auction:quit', (bid)=>{
	output.innerHTML += '<p><strong>'+bid.client+' quit</strong></p>';
})

