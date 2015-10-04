// http://boe.es/diario_boe/xml.php?id=BOE-S-20150903

var amqp = require('amqplib');
var when = require('when');
var http = require('http');

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var urlsQueue = 'boe.urls';
        var ok = ch.assertQueue(
            urlsQueue,
            {durable: true}
        );

        ok.then(function(_qok) {
            var url = '{"url": "http://boe.es/diario_boe/xml.php?id=BOE-S-20150903"}';
            ch.sendToQueue(urlsQueue, new Buffer(url));
            console.log("Published url: " + url);
        });
    }));
});