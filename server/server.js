var WebSocketServer = new require('ws');

// подключенные клиенты
var clients = {};

console.log('Server Started');

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function(ws) {

    var id = Math.random();
    clients[id] = ws;
    console.log("новое соединение " + id);

    ws.on('message', function(message, flags) {
    	console.log(flags);

    	if (flags.binary === true) {
    		console.log('We got an ArrayBuffer');
    		sendImage(message, clients[id].name || id);
    	} else {
    		console.log('Got string message');
	    	console.log(message);
	        var messageObj = JSON.parse(message);

	        sendServerMessage(message);

	        if (messageObj.type === 'change-name') {
	            sendServerMessage('User '+ id + ' from now on ' + messageObj.name);
	            clients[id].name = messageObj.name;
	        } else if (messageObj.type === 'image') {
	        	console.log('We got an image');
	        	sendImage(messageObj, clients[id].name || id);
	        }
	        else {
	        	console.log('Получено текстовое сообщение ' + message);
	            sendMessage(messageObj.message, clients[id].name || id);
    		}
    	}
    });

    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });
});

function sendServerMessage(message) {
	sendMessage(message, 'Server');
}

function sendImage(data, user) {
    for(var key in clients) {
        clients[key].send(JSON.stringify({
            'type': 'image',
            'data': data.data,
            'height': data.height,
            'date': new Date(),
            'user': user
        }));
    }
}

function sendMessage(message, user) {
    for(var key in clients) {
        clients[key].send(JSON.stringify({
            'data': message,
            'date': new Date(),
            'user': user
        }));
    }
}