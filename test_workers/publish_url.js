var amqp = require('amqplib');
var when = require('when');

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var boeUrl = "http://boe.es/diario_boe/xml.php?id=BOE-S-20151001";

        var urlsQueue = 'boe_crawler.boe_urls';
        var ok = ch.assertQueue(
            urlsQueue,
            {durable: true}
        );

        ok.then(function() {
            var url = {
                "created_at": new Date().toISOString(),
                "url": boeUrl
            };
            ch.sendToQueue(urlsQueue, new Buffer(JSON.stringify(url)));
            console.log("Published url: " + url.url);
        });
    }));
});