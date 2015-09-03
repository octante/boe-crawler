var nats = require('nats').connect();

// Simple Publisher
nats.publish('foo', 'Hello World!');

// Simple Subscriber
nats.subscribe('foo', function(msg) {
    console.log('Received a message: ' + msg);
});

// Unsubscribing
var sid = nats.subscribe('foo', function(msg) {});
nats.unsubscribe(sid);

// Requests
nats.request('help', function(response) {
    console.log('Got a response for help: ' + response);
});

// Replies
nats.subscribe('help', function(request, replyTo) {
    nats.publish(replyTo, 'I can help!');
});

// Close connection
nats.close();