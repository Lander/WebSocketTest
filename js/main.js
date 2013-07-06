function WebSocketTest(options){
    options = $.extend({}, WebSocketTest.defaultOptions, options);
    this.options = options;
}

WebSocketTest.defaultOptions = {
    wsURL: 'ws://10.18.45.6:8081',
    wsForm: '.form-output',
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

WebSocketTest.prototype.postMessage = function(json){
    var message = JSON.parse(json);
    $(this.options.wsBoard).append(
        '<div class="message">' +
            '<div class="message-user">' + message.user + '</div>' +
            '<div class="message-content">' + message.data + '</div>' +
            '<div class="message-time">' + message.date + '</div>' +
        '</div>'
    );
};

$(function(){
    var webSocketTest = new WebSocketTest();
    webSocketTest.init();
});