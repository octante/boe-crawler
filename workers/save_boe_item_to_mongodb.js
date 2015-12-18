var amqp = require('amqplib');
var when = require('when');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var insertItem = function(db, boe_item) {
    var collection = db.collection('boe_items');
    try {
        collection.insert(boe_item);
    } catch (err) {
        console.log('An error occurred when inserting boe item: "' + err + '"');
    }
};

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var parsedItemsQueue = 'boe_crawler.boe_parsed_items';
        var ok = ch.assertQueue(
            parsedItemsQueue,
            {durable: true}
        );

        ok.then(function(_qok) {
            ch.consume(parsedItemsQueue, function(msg) {
                var boe_item = JSON.parse(msg.content.toString());

                    // Save item to mongodb database
                    var url = 'mongodb://localhost:27017/boe';
                    MongoClient.connect(url, function(err, db) {

                        assert.equal(null, err);

                        boe_item['created_at'] = new Date().toISOString();

                        console.log(boe_item['id']);

                        insertItem(db, boe_item);

                        db.close();
                    });

            }, {noAck: false});
        });
    }));
});
