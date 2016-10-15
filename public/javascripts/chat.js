var socket = io.connect('http://localhost:8080');

(function() {
    var lastMessage = 0, $welcome = $('.welcome'), $chatbox = $('#chatbox'), $name = $('#name');
    var $message = $('#message');

    function SendMessage() {
        socket.emit('chat message', $message.val());
        $message.val('');
    }

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

    $message.on('keyup', function(event) {
        if(event.keyCode == 13) {
            SendMessage();
        }
    })

    $('#sendMessage').on('click', function() {
        SendMessage();
    });

    socket.on('chat message', function(msg) {
        console.log(msg)
        var m = '<p><span class="sender" ' + $name.val() + '</span>: ' + msg + '<hr /></p>';
        $chatbox.append(m);
    });
})();