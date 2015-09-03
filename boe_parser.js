var amqp = require('amqplib');
var when = require('when');
var http = require('http');
var select = require('xpath.js');
var dom = require('xmldom');

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var contentQueue = 'boe.content';
        var ok = ch.assertQueue(
            contentQueue,
            {durable: true}
        );

        ok.then(function(_qok) {
            ch.consume(contentQueue, function(msg) {
                var boe_diary = msg.content.toString();
                var domParser = dom.DOMParser;

                var document = JSON.parse(boe_diary);
                var doc = new domParser().parseFromString(document['data']);
                //console.log(boe_diary['data']);
                console.log("value: " + select(doc, "//sumario/meta/pub/text()"));

            }, {noAck: true});
        });
    }));
});