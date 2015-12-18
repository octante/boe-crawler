var amqp = require('amqplib');
var when = require('when');
var parseString = require('xml2js').parseString;

var boe_parser = require('../parsers/boe');

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var contentQueue = 'boe_crawler.boes';
        var ok = ch.assertQueue(
            contentQueue,
            {durable: true}
        );

        ok.then(function(_qok) {
            ch.consume(contentQueue, function(msg) {
                var boe_diary = msg.content.toString();

                parseString(JSON.parse(boe_diary)['data'], function (err, result) {
                    var parsedData = result;

                    var items = boe_parser.parse(parsedData);

                    // Send downloaded data to content queue
                    amqp.connect('amqp://localhost').then(function (conn) {
                        return when(conn.createChannel().then(function (ch) {

                            items.forEach(function(item){
                                // Send data to the queue
                                var itemsQueue = 'boe_crawler.boe_items_urls';
                                var ok = ch.assertQueue(
                                    itemsQueue,
                                    {durable: true}
                                );
                                ok.then(function (_qok) {
                                   ch.sendToQueue(itemsQueue, new Buffer(JSON.stringify(item)));
                                   console.log("Sent item: " + item['id']);
                                });
                            });
                        }));
                    });

                    // Send next boe to parse to urls queue
                    var splittedDate = parsedData['sumario']['meta'][0]['fechaSig'][0].split('/');
                    var url = "http://boe.es/diario_boe/xml.php?id=BOE-S-"
                                + splittedDate[2] + splittedDate[1] + splittedDate[0];

                    // Send downloaded data to content queue
                    amqp.connect('amqp://localhost').then(function (conn) {
                        return when(conn.createChannel().then(function (ch) {

                            // Send data to the queue
                            var urlsQueue = 'boe_crawler.boe_urls';
                            var ok = ch.assertQueue(
                                urlsQueue,
                                {durable: true}
                            );

                            var urlData = {
                                'created_at': new Date().toISOString(),
                                'url': url
                            };
                            ok.then(function (_qok) {
                                ch.sendToQueue(urlsQueue, new Buffer(JSON.stringify(urlData)));
                                console.log("Sent BOE url: " + urlData['url']);
                            });
                        }));
                    });
                });
            }, {noAck: false});
        });
    }));
});