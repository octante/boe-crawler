var amqp = require('amqplib');
var when = require('when');
var http = require('../lib/http');

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var itemsQueue = 'boe_crawler.boe_items_urls';
        var ok = ch.assertQueue(
            itemsQueue,
            {durable: true}
        );

        ok.then(function(_qok) {
            ch.consume(itemsQueue, function(msg) {
                var document = JSON.parse(msg.content.toString());

                var url = "http://boe.es" + document['urlXml'];

                try {
                    http.get(url, function (boe_item) {
                        amqp.connect('amqp://localhost').then(function (conn) {
                            return when(conn.createChannel().then(function (ch) {

                                var parsedItemQueue = 'boe_crawler.boe_items';
                                var ok = ch.assertQueue(
                                    parsedItemQueue,
                                    {durable: true}
                                );

                                ok.then(function () {
                                    var contentDocument = {
                                        'created_at': new Date().toISOString(),
                                        'data': boe_item
                                    };

                                    ch.sendToQueue(parsedItemQueue, new Buffer(JSON.stringify(contentDocument)));
                                    console.log("Sent downloaded item: " + document['urlXml']);
                                });
                            }));
                        });
                    });

                } catch (err) {
                    console.log('An error occurred downloading boe item: ' + document['urlXml'] + "[" + err + "]");
                }

            }, {noAck: true});
        });
    }));
});
