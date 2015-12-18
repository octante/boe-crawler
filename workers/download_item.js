var amqp = require('amqplib');
var when = require('when');
var http = require('http');

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
                var boe_item = JSON.parse(msg.content.toString());

                var url = "http://boe.es" + boe_item['urlXml'];

                http.get(url, function(response) {
                    if (response.statusCode == '200') {

                        var boeData = '';
                        response.on('data', function (chunk) {
                            boeData += chunk.toString();
                        });

                        response.on('end', function(){

                            // Send downloaded data to content queue
                            amqp.connect('amqp://localhost').then(function (conn) {
                                return when(conn.createChannel().then(function (ch) {

                                    // Send data to the queue
                                    var parsedItemQueue = 'boe_crawler.boe_items';
                                    var ok = ch.assertQueue(
                                        parsedItemQueue,
                                        {durable: true}
                                    );

                                    ok.then(function (_qok) {
                                        var contentDocument = {
                                            'created_at': new Date().toISOString(),
                                            'data': boeData
                                        };

                                        ch.sendToQueue(parsedItemQueue, new Buffer(JSON.stringify(contentDocument)));
                                        console.log("Sent downloaded item: " + boe_item['id']);
                                    });
                                }));
                            });
                        });
                    } else {
                        // Do something
                    }
                });

            }, {noAck: false});
        });
    }));
});
