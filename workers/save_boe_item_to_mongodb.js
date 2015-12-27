var amqp = require('amqplib');
var when = require('when');
var mongodb = require('../lib/mongodb');

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var parsedItemsQueue = 'boe_crawler.boe_parsed_items';
        var ok = ch.assertQueue(
            parsedItemsQueue,
            {durable: true}
        );

        ok.then(function() {
            ch.consume(parsedItemsQueue, function(msg) {
                var boe_item = JSON.parse(msg.content.toString());

                try {
                    mongodb.findOneById('boe', 'boe_items', boe_item['id'], function(){
                        boe_item['created_at'] = new Date().toISOString();
                        mongodb.insert('boe', 'boe_items', boe_item);
                        console.log('Inserted item: ' + boe_item['id']);
                    });
                } catch (err) {
                    console.log('An error occurred when inserting boe item (' + boe_item['id'] + '): [' + err + ']');
                }

            }, {noAck: true});
        });
    }));
});
