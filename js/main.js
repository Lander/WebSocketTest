function WebSocketTest(options){
    options = $.extend({}, WebSocketTest.defaultOptions, options);
    this.options = options;
}

WebSocketTest.defaultOptions = {
    wsURL: 'ws://127.0.0.1:8081',
    wsOutputForm: '.form-output',
    wsBoard: '#input',
    wsUsernameForm: '.form-username',
    wsModal: '.modal',
    wsOverlay: '.overlay',
    wsDebug: '.debug',
    wsSettings: '.form-output__settings',
    wsAttach: '.form-output__attach'
};

WebSocketTest.prototype.init = function(){
    ws = new WebSocket(this.options.wsURL);
        var _this = this;

    $(this.options.wsOutputForm).on({
        submit: function(e){
            e.preventDefault();
            var message = new TextMessage();
            ws.send(message.prepare(this.message.value));
            this.message.value = '';
            this.message.focus();
        }
    });

    $(this.options.wsUsernameForm).on({
        submit: function(e){
            e.preventDefault();
            ws.send(JSON.stringify({
                'type': 'change-name',
                'name': this.username.value
            }));
            _this.closeModal();
            window.localStorage.setItem('username', this.username.value);
            this.username.value = '';
        }
    });

    $(this.options.wsSettings).on({
        click: function(e){
            e.preventDefault();
            _this.openModal();
        }
    });

    this.loadUsername(ws);

    ws.onmessage = function(e) {
        _this.postMessage(e.data);
    };

    $(this.options.wsAttach)[0].ondragover = function(e){
        e.preventDefault();
    };
    $(this.options.wsAttach)[0].ondragend = function(){
        e.preventDefault();
    };
    $(this.options.wsAttach)[0].ondrop = function(e){
        e.preventDefault();

        var img = document.createElement("img"),
            file = e.dataTransfer.files[0],
            reader = new FileReader();

        reader.onload = function(e){
//            img.src = e.target.result;
//            messageHeight = img.height;
//            $('<div class="message"></div>').css({
//                'background': 'url(' + e.target.result + ') no-repeat 50% 50%',
//                'height': messageHeight
//            }).prependTo(_this.options.wsBoard);
            ws.send(e.target.result);
        };
        reader.readAsArrayBuffer(file);

        return false;
    };
};

WebSocketTest.prototype.postMessage = function(json){
    var message = JSON.parse(json);
    if (message.type === 'image') {
        console.log(message);
        var blob = new Blob([message.data], {type: "image/png"});
            $('<div class="message"></div>').css({
                'background': 'url(' + blob + ') no-repeat 50% 50%',
                'height': blob
            }).prependTo($('#input'));
    }

    if(message.user == 'Server'){
        $(this.options.wsDebug).show();
        if($('.debug__message').length >= 5){
            $('.debug__message').eq(0).remove();
        }
        $(this.options.wsDebug).append(
            '<div class="debug__message">' +
                '<div>' + message.user + '</div>' +
                '<div>' + message.data + '</div>' +
                '<div>' + message.date + '</div>' +
            '</div>'
        );
    } else {
        $(this.options.wsBoard).prepend(
            '<div class="message">' +
                '<div class="message-user">' + message.user + '</div>' +
                '<div class="message-content">' + message.data + '</div>' +
                '<div class="message-time">' + message.date + '</div>' +
            '</div>'
        );
    }
};

WebSocketTest.prototype.closeModal = function(){
    $(this.options.wsModal).hide();
    $(this.options.wsOverlay).hide();
};

WebSocketTest.prototype.openModal = function(){
    $(this.options.wsModal).show();
    $(this.options.wsOverlay).show();
};

WebSocketTest.prototype.loadUsername = function(ws){
//    if(window.localStorage.getItem('username')){
//        ws.send(JSON.stringify({
//            'type': 'change-name',
//            'name': window.localStorage.getItem('username')
//        }));
//        this.closeModal();
//    }
//    console.log(window.localStorage.getItem('username'));
};

$(function(){
    var webSocketTest = new WebSocketTest();
    webSocketTest.init();
});