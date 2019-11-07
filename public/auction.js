const socket = io();

let bid = document.getElementById('bid');
let client = document.getElementById('client');
let output = document.getElementById('output');
let btnBid = document.getElementById('btnBid');
let btnQuit = document.getElementById('btnQuit');
let itemId = document.getElementById('itemid');


socket.on('welcome', (data)=>{
	axios.get("/getData").then(res => {
               console.log(res.data);
              Swal.fire({
              title: 'Auction for #'+ res.data.number+ '  '+res.data.name+ ' begins...',
			  text: res.data.desc,
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  //cancelButtonColor: '#d33',
			  confirmButtonText: 'Ok!'
			});
          	itemId.value = res.data.number;
            });

});


socket.on('bid:receive', (bid)=>{
	output.innerHTML += '<p><strong>$'+bid.quantity+' by '+bid.client+'</strong></p>';

});


btnBid.addEventListener('click', ()=>{
	socket.emit('bid:send', {
			quantity: bid.value.trim(),
			client: client.value.trim(),
			id: itemId.value
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
	  text: 'SOLD for '+bid.quantity+ ' to '+bid.client,
	  confirmButtonColor: '#3085d6',
	  confirmButtonText: 'Ok!'
	});
})

socket.on('auction:quit', (bid)=>{
	output.innerHTML += '<p><strong>'+bid.client+' quit</strong></p>';
})