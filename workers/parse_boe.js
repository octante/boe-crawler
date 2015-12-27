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

        ok.then(function() {
            ch.consume(contentQueue, function(msg) {
                var boe_diary = msg.content.toString();

                parseString(JSON.parse(boe_diary)['data'], function (err, result) {
                    var parsedData = result;

                    try {
                        var items = boe_parser.parse(parsedData);
                    } catch (err) {
                        console.log("Error parsing boe [" + err + "]");
                    }

                    // Send downloaded data to content queue
                    amqp.connect('amqp://localhost').then(function (conn) {
                        return when(conn.createChannel().then(function (ch) {

                            items.forEach(function(item){

                                try {
                                    var itemsQueue = 'boe_crawler.boe_items_urls';
                                    var ok = ch.assertQueue(
                                        itemsQueue,
                                        {durable: true}
                                    );
                                    ok.then(function () {
                                        ch.sendToQueue(itemsQueue, new Buffer(JSON.stringify(item)));
                                        console.log("Sent item: " + item['id']);
                                    });
                                } catch (err) {
                                    console.log('Error occurred sending boe_item (' + item['id'] + ')url [' + err + ']');
                                }
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

                            var urlsQueue = 'boe_crawler.boe_urls';
                            var ok = ch.assertQueue(
                                urlsQueue,
                                {durable: true}
                            );

                            var urlData = {
                                'created_at': new Date().toISOString(),
                                'url': url
                            };

                            try {
                                ok.then(function () {
                                    ch.sendToQueue(urlsQueue, new Buffer(JSON.stringify(urlData)));
                                    console.log("Sent BOE url: " + urlData['url']);
                                });
                            } catch (err) {
                                console.log('Error occurred sending next boe url  (' + urlData['url'] + ')[' + err + ']');
                            }
                        }));
                    });
                });
            }, {noAck: true});
        });
    }));
});