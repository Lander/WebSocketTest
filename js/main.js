var ws = new WebSocket("ws://localhost:8081");

$(function(){
    $('#output').on({
        submit: function(e){
            e.preventDefault();
            ws.send(this.message.value);
        }
    });
});