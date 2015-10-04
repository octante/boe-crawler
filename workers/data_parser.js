var amqp = require('amqplib');
var when = require('when');
var parseString = require('xml2js').parseString;

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var contentQueue = 'boe.content';
        var ok = ch.assertQueue(
            contentQueue,
            {durable: true}
        );

        ok.then(function(_qok) {
            ch.consume(contentQueue, function(msg) {
                var boe_diary = msg.content.toString();

                parseString(JSON.parse(boe_diary)['data'], function (err, result) {
                    var parsedData = result;

                    // meta data
                    var data = {};

                    var items = [];

                    data['meta'] = {
                        'date': parsedData['sumario']['meta'][0]['fecha'][0]
                    };

                    var pdfData = parsedData['sumario']['diario'][0]['sumario_nbo'][0]['urlPdf'][0];

                    data['pdf'] = {
                        'url': pdfData['_'],
                        'szBytes': pdfData['$']['szBytes'],
                        'szKBytes': pdfData['$']['szKBytes']
                    };

                    data['sections'] = [];

                    var sectionsData = parsedData['sumario']['diario'][0]['seccion'];
                    for (var section in sectionsData) {

                        var sectionData = {
                            'num': sectionsData[section]['$']['num'],
                            'name': sectionsData[section]['$']['nombre']
                        };

                        var departmentsData = sectionsData[section]['departamento'];
                        for (var department in departmentsData) {
                            var departmentData = {
                                'name': departmentsData[department]['$']['nombre']
                            };

                            if (departmentsData[department]['epigrafe'] != undefined) {
                                var epigraphsData = departmentsData[department]['epigrafe'];

                                var epigraphData = {'items': []};
                                for (var epigraph in epigraphsData) {
                                    epigraphData = {
                                        'name': epigraphsData[epigraph]['$']['nombre']
                                    };

                                    var itemsData = epigraphsData[epigraph]['item'];

                                    for (var item in itemsData) {
                                        var itemData = {
                                            'id': itemsData[item]['$']['id'],
                                            'title': itemsData[item]['titulo'][0],
                                            'urlPdf': {
                                                'url': itemsData[item]['urlPdf'][0]['_'],
                                                'szBytes': itemsData[item]['urlPdf'][0]['$']['szBytes'],
                                                'szKBytes': itemsData[item]['urlPdf'][0]['$']['szKBytes'],
                                                'numPag': itemsData[item]['urlPdf'][0]['$']['numPag']
                                            },
                                            'urlHtml': itemsData[item]['urlHtm'][0],
                                            'urlXml': itemsData[item]['urlXml'][0],
                                            'section': sectionData,
                                            'department': departmentData,
                                            'epigraph': epigraphData
                                        };

                                        items.push(itemData);
                                    }
                                }
                            } else {
                                var itemsData = departmentsData[department]['item'];

                                for (var item in itemsData) {
                                    var itemData = {
                                        'created_at': new Date().toISOString(),
                                        'id': itemsData[item]['$']['id'],
                                        'title': itemsData[item]['titulo'][0],
                                        'urlPdf': {
                                            'url': itemsData[item]['urlPdf'][0]['_'],
                                            'szBytes': itemsData[item]['urlPdf'][0]['$']['szBytes'],
                                            'szKBytes': itemsData[item]['urlPdf'][0]['$']['szKBytes'],
                                            'numPag': itemsData[item]['urlPdf'][0]['$']['numPag']
                                        },
                                        'urlHtml': itemsData[item]['urlHtm'][0],
                                        'urlXml': itemsData[item]['urlXml'][0],
                                        'section': sectionData,
                                        'department': departmentData
                                    };

                                    items.push(itemData);
                                }
                            }
                        }
                    }

                    // Send downloaded data to content queue
                    amqp.connect('amqp://localhost').then(function (conn) {
                        return when(conn.createChannel().then(function (ch) {

                            items.forEach(function(item){
                                // Send data to the queue
                                var itemsQueue = 'boe.items';
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
                            var urlsQueue = 'boe.urls';
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