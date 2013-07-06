var ws = new WebSocket("ws://localhost:8081");

$('.output').on({
    submit: function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log(this);
    }
});