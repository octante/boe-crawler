var amqp = require('amqplib');
var when = require('when');
var parseString = require('xml2js').parseString;
var parse_item = require("../modules/parse_item");

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var itemsQueue = 'boe_crawler.boe_items';
        var ok = ch.assertQueue(
            itemsQueue,
            {durable: true}
        );

        ok.then(function() {
            ch.consume(itemsQueue, function(msg) {
                var boe_item = msg.content.toString();

                var boe_item_raw = JSON.parse(boe_item);

                parseString(JSON.parse(boe_item)['data'], function (err, result) {

                    var parsedData = result;

                    var boe_item_data = {}

                    try{
                        boe_item_data['created_at'] = boe_item_raw['created_at'];
                        boe_item_data['data'] = boe_item_raw['data'];
                        boe_item_data['text'] = parse_item.getText(boe_item_raw['data']);

                        var metadata = parsedData['documento']['metadatos'][0];

                        boe_item_data = parse_item.getGeneralData(metadata, boe_item_data);

                        var analysis = parsedData['documento']['analisis'][0];

                        if (analysis['notas'] != undefined) {
                            boe_item_data = parse_item.getNotes(analysis, boe_item_data);
                        }

                        if (analysis['materias'] != undefined) {
                            boe_item_data = parse_item.getSubjects(analysis, boe_item_data);
                        }

                        if (analysis['alertas'] != undefined) {
                            boe_item_data = parse_item.getAlerts(analysis, boe_item_data);
                        }

                        if (analysis['referencias'] != undefined) {
                            boe_item_data = parse_item.getReferences(analysis, boe_item_data);
                        }

                        // Send downloaded data to content queue
                        amqp.connect('amqp://localhost').then(function (conn) {
                            return when(conn.createChannel().then(function (ch) {

                                var parsedItemQueue = 'boe_crawler.boe_parsed_items';
                                var ok = ch.assertQueue(
                                    parsedItemQueue,
                                    {durable: true}
                                );

                                ok.then(function () {
                                    ch.sendToQueue(parsedItemQueue, new Buffer(JSON.stringify(boe_item_data)));
                                    console.log("Sent parsed item: " + boe_item_data['id']);
                                });
                            }));
                        });
                    } catch (err) {
                        console.log('An error occurred when parsing boe_item (' + boe_item_data['id'] + '): "' + err + '"');
                    }
                });
            }, {noAck: true});
        });
    }));
});