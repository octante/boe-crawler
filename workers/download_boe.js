var amqp = require('amqplib');
var when = require('when');
var http = require('http');
var sleep = require('sleep');

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var urlsQueue = 'boe_crawler.boe_urls';
        var ok = ch.assertQueue(
            urlsQueue,
            {durable: true}
        );

        ok.then(function(_qok) {
            ch.consume(urlsQueue, function(msg) {
                var boe_link = msg.content.toString();

                // Download page and save content to another rabbit queue
                var document = JSON.parse(boe_link);

                http.get(document['url'], function(response) {
                    if (response.statusCode == '200') {

                        // Get data
                        var boeData = '';
                        response.on('data', function (chunk) {
                            boeData += chunk.toString();
                        });

                        response.on('end', function(){

                            // Send downloaded data to content queue
                            amqp.connect('amqp://localhost').then(function (conn) {
                                return when(conn.createChannel().then(function (ch) {

                                    // Send data to the queue
                                    var contentQueue = 'boe_crawler.boes';
                                    var ok = ch.assertQueue(
                                        contentQueue,
                                        {durable: true}
                                    );
                                    ok.then(function (_qok) {
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
                    } else {
                        // Do something
                    }
                });

                // Sleep 1 second
                sleep.sleep(1);

            }, {noAck: false});
        });
    }));
});
