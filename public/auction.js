const socket = io();

let bid = document.getElementById('bid');
let client = document.getElementById('client');
let output = document.getElementById('output');
let btnBid = document.getElementById('btnBid');
let btnQuit = document.getElementById('btnQuit');


socket.on('welcome', (data)=>{
		 Swal.fire({
              title: 'Auction begins...',
			  imageUrl: 'https://placeholder.pics/svg/300x1500',
			  imageHeight: 150,
			  imageAlt: 'A tall image',
			  text: 'Item description',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  //cancelButtonColor: '#d33',
			  confirmButtonText: 'Ok!'
			});
});


socket.on('bid:receive', (bid)=>{
	output.innerHTML += '<p><strong>$'+bid.quantity+' by '+bid.client+'</strong></p>';

});


btnBid.addEventListener('click', ()=>{
	socket.emit('bid:send', {
			quantity: bid.value.trim(),
			client: client.value.trim()
		});
});




btnQuit.addEventListener('click', ()=>{
	Swal.fire({
	  title: 'Are you sure?',
	  text: "You will not be able to return!",
	  icon: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Yes'
	}).then((result) => {
	  if (result.value) {
	    Swal.fire(
	      'Quit!',
	      'You have abandoned the auction.',
	      'success'
	    )
	   socket.emit('auction:quit', {
			quantity: bid.value.trim(),
			client: client.value.trim()
		});	  
	  }
	})
	
});


socket.on('auction:closed', (bid)=>{
	 Swal.fire({
      title: 'Auction closed...',
	  text: 'Item SOLD for '+bid.quantity+ ' to '+bid.client,
	  confirmButtonColor: '#3085d6',
	  confirmButtonText: 'Ok!'
	});
})

socket.on('auction:quit', (bid)=>{
	output.innerHTML += '<p><strong>'+bid.client+' quit</strong></p>';
})