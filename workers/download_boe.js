var amqp = require('amqplib');
var when = require('when');
var http = require('../lib/http');
var sleep = require('sleep');

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var urlsQueue = 'boe_crawler.boe_urls';
        var ok = ch.assertQueue(
            urlsQueue,
            {durable: true}
        );

        ok.then(function() {
            ch.consume(urlsQueue, function(msg) {

                var document = JSON.parse(msg.content.toString());

                try {
                    http.get(document['url'], function (boeData) {
                        amqp.connect('amqp://localhost').then(function (conn) {
                            return when(conn.createChannel().then(function (ch) {

                                var contentQueue = 'boe_crawler.boes';
                                var ok = ch.assertQueue(
                                    contentQueue,
                                    {durable: true}
                                );

                                ok.then(function () {
                                    var contentDocument = {
                                        'created_at': new Date().toISOString(),
                                        'data': boeData
                                    };
                                    ch.sendToQueue(contentQueue, new Buffer(JSON.stringify(contentDocument)));
                                    console.log("Sent message: " + document['url']);
                                });
                            }));
                        });
                    });

                } catch (err) {
                    console.log('An error occurred downloading boe: ' + document['url'] + "["+ err + "]");
                }

            }, {noAck: true});
        });
    }));
});
