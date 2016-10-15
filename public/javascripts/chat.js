var socket = io.connect('http://localhost:8080');

(function() {
    $('#sendMessage').on('click', function() {
        socket.emit('chat message', $('#message').val());
        $('#message').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        console.log(msg)
        var m = '<p><span class="sender" ' + msg + '</span>: ' + msg + '<hr /></p>';
        $('#chatbox').append(m);
    });
})();