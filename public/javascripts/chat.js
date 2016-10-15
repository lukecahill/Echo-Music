var socket = io.connect('http://localhost:8080');

(function() {
    var lastMessage = 0, $welcome = $('.welcome'), $chatbox = $('#chatbox'), $name = $('#name');
    var $message = $('#message');

    $welcome.hide();

	/**
	* @function SendMessage
	*
	* Sends the message using the socket connection.
	**/
    function SendMessage() {
        socket.emit('chat message', $message.val());
        $message.val('');
    }

	/**
	* @function SetName
	*
	* Sets the users username. This is displayed in the chat, and is also saved to the database.
	**/
    function SetName() {
        var setName = $.trim($name.val());
        if($name !== '') {
            $welcome.html('Welcome, <b>' + setName + '</b>');
            $('#setYourName').hide();
            $welcome.show();
        } else {
            alert('Your name cannot be blank!');
        }
    }

	/**
	* @function CheckForName
	*
	* Checks that the user has entered a value for the name field.
	**/
    function CheckForName() {
        var nameCheck = $.trim($name.val());
        if(nameCheck == '') {
            return false;
        } else {
            return true;
        }
    }

    $message.on('keyup', function(event) {
        if(event.keyCode == 13) {
            SendMessage();
        }
    })

	/**
	* @function 
	*
	* Fires the SendMessage() function when the send message button is clicked.
	**/
    $('#sendMessage').on('click', function() {
        SendMessage();
    });

	/**
	* @function 
	*
	* Appends the new messages to the chatbox when they are recieved. 
	**/
    socket.on('chat message', function(msg) {
        var m = '<p><span class="sender" ' + $name.val() + '</span>: ' + msg + '<hr /></p>';
        $chatbox.append(m);
    });

	/**
	* @function 
	*
	* Fires the SetName() functoin when the set name button is clicked.
	**/
    $('#setName').on('click', function() {
        SetName();
    });

	/**
	* @function 
	*
	* Fires the SetName() function when the return key is pressed inside the name input.
	**/
    $('#name').on('keyup', function(event) {
        if(event.keyCode == 13) {
            SetName();
        }
    });

})();