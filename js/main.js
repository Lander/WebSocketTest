function WebSocketTest(options){
    options = $.extend({}, WebSocketTest.defaultOptions, options);
    this.options = options;
}

WebSocketTest.defaultOptions = {
    wsURL: 'ws://10.18.45.6:8081',
    wsForm: '#output',
    wsBoard: '#input'
};

WebSocketTest.prototype.init = function(){
    var ws = new WebSocket(this.options.wsURL),
        _this = this;

    $(this.options.wsForm).on({
        submit: function(e){
            e.preventDefault();
            var message = new TextMessage();
            ws.send(message.prepare(this.message.value));
        }
    });

    ws.onmessage = function(e) {
        _this.postMessage(e.data);
    };
};

WebSocketTest.prototype.postMessage = function(message){
    $(this.options.wsBoard).append('<div>' + message + '</div>');
};

$(function(){
    var webSocketTest = new WebSocketTest();
    webSocketTest.init();
});