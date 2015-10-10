var amqp = require('amqplib');
var when = require('when');
var http = require('http');
var parseString = require('xml2js').parseString;

function getMetadataValue(data, field) {
    if (data[field] != undefined) {
        return data[field][0];
    }

    return '';
}

amqp.connect('amqp://localhost').then(function(conn) {

    process.once('SIGINT', function() { conn.close(); });

    return when(conn.createChannel().then(function(ch) {

        var itemsQueue = 'boe.items';
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

                        // Get data
                        var boeData = '';
                        response.on('data', function (chunk) {
                            boeData += chunk.toString();
                        });

                        response.on('end', function(){

                            boe_item['text'] = boeData.substring(
                                boeData.indexOf('<p class="parrafo">'),
                                boeData.indexOf('</documento>')
                            ).replace('</texto>', '');

                            parseString(boeData, function (err, result) {
                                var parsedData = result;

                                var metadata = parsedData['documento']['metadatos'][0];

                                console.log(url);

                                boe_item['parsed_at'] = new Date().toISOString();
                                boe_item['department']['code'] = metadata['departamento'][0]['$']['codigo'];

                                boe_item['id'] = getMetadataValue(metadata, 'identificador');
                                boe_item['diary_num'] = getMetadataValue(metadata, 'diario_numero');

                                boe_item['section'] = getMetadataValue(metadata, 'seccion');
                                boe_item['subsection'] = getMetadataValue(metadata, 'subseccion');
                                boe_item['oficial_number'] = getMetadataValue(metadata, 'numero_oficial');
                                boe_item['ad_num'] = getMetadataValue(metadata, 'numero_anuncio');

                                if (metadata['rango'] != undefined) {
                                    boe_item['range'] = {
                                        'code': metadata['rango'][0]['$'],
                                        'name': metadata['rango'][0]['_']
                                    };
                                }

                                boe_item['image_letter'] = getMetadataValue(metadata, 'letra_imagen');
                                boe_item['initial_page'] = getMetadataValue(metadata, 'pagina_inicial');
                                boe_item['end_page'] = getMetadataValue(metadata, 'pagina_final');

                                boe_item['disposition_date'] = getMetadataValue(metadata, 'fecha_disposicion');
                                boe_item['publication_date'] = getMetadataValue(metadata, 'fecha_publicacion');
                                boe_item['vigency_date'] = getMetadataValue(metadata, 'fecha_vigencia');
                                boe_item['abolition_date'] = getMetadataValue(metadata, 'fecha_derogacion');
                                boe_item['suplement_image_letter'] = getMetadataValue(metadata, 'suplemento_letra_imagen');
                                boe_item['suplement_initial_page'] = getMetadataValue(metadata, 'suplement_initial_page');
                                boe_item['suplement_final_page'] = getMetadataValue(metadata, 'suplemento_pagina_final');
                                boe_item['legislative_status'] = getMetadataValue(metadata, 'estatus_legislativo');

                                if (metadata['origen_legislativo'] != undefined) {
                                    boe_item['legislative_origin'] = {
                                        'code': metadata['origen_legislativo'][0]['$']['codigo'],
                                        'name': metadata['origen_legislativo'][0]['_']
                                    };
                                }

                                if (metadata['estado_consolidacion'] != undefined) {
                                    boe_item['consolidation_status'] = {
                                        'code': metadata['estado_consolidacion'][0]['$']['codigo'],
                                        'name': metadata['estado_consolidacion'][0]['_']
                                    };
                                }

                                boe_item['judicially_annulled'] = getMetadataValue(metadata, 'judicialmente_anulada');
                                boe_item['exhausted_force'] = getMetadataValue(metadata, 'vigencia_agotada');
                                boe_item['abolition_status'] = getMetadataValue(metadata, 'estatus_derogacion');
                                boe_item['url_epub'] = getMetadataValue(metadata, 'url_epub');
                                boe_item['url_pdf'] = getMetadataValue(metadata, 'url_pdf');

                                // Is not saved correctly
                                boe_item['url_pdf_catalan'] = getMetadataValue(metadata, 'url_pdf_catalan');
                                boe_item['url_pdf_euskera'] = getMetadataValue(metadata, 'url_pdf_euskera');
                                boe_item['url_pdf_gallego'] = getMetadataValue(metadata, 'url_pdf_gallego');
                                boe_item['url_pdf_valenciano'] = getMetadataValue(metadata, 'url_pdf_valenciano');

                                var analysis = parsedData['documento']['analisis'][0];

                                if (analysis['notas'] != undefined) {
                                    boe_item['notes'] = [];
                                    analysis['notas'].forEach(function (note) {

                                        if (note['nota'] != undefined) {
                                            var noteData = {
                                                'code': note['nota'][0]['$']['codigo'],
                                                'order': note['nota'][0]['$']['orden'],
                                                'name': note['nota'][0]['_']
                                            };
                                            boe_item['notes'].push(noteData);
                                        }
                                    });
                                }

                                if (analysis['materias'] != undefined) {
                                    boe_item['subjects'] = [];
                                    analysis['materias'].forEach(function (subjects) {

                                        if (subjects['materia'] != undefined) {
                                            subjects['materia'].forEach(function (subject) {
                                                var subjectData = {
                                                    'code': subject['$']['codigo'],
                                                    'order': subject['$']['orden'],
                                                    'name': subject['_']
                                                };
                                                boe_item['subjects'].push(subjectData);
                                            });
                                        }
                                    });
                                }

                                if (analysis['alertas'] != undefined) {
                                    boe_item['alerts'] = [];
                                    analysis['alertas'].forEach(function (alerts) {

                                        if (alerts['alerta'] != undefined) {
                                            alerts['alerta'].forEach(function (alert) {
                                                var alertData = {
                                                    'code': alert['$']['codigo'],
                                                    'order': alert['$']['orden'],
                                                    'name': alert['_']
                                                };
                                                boe_item['alerts'].push(alertData);
                                            });
                                        }
                                    });
                                }

                                if (analysis['referencias'] != undefined) {
                                    boe_item['references'] = [];
                                    analysis['referencias'].forEach(function (reference) {

                                        boe_item['references'] = {
                                            'before': [],
                                            'after': []
                                        };

                                        if (reference['anteriores'] != undefined) {
                                            reference['anteriores'].forEach(function (beforeReferences) {

                                                if (beforeReferences['anterior'] != undefined) {
                                                    beforeReferences['anterior'].forEach(function (beforeReference) {
                                                        var beforeReferenceData = {
                                                            'reference': beforeReference['$']['referencia'],
                                                            'order': beforeReference['$']['orden'],
                                                            'text': beforeReference['texto']
                                                        };

                                                        boe_item['references']['before'].push(beforeReferenceData);
                                                    });
                                                }
                                            });
                                        }

                                        if (reference['posteriores'] != undefined) {
                                            reference['posteriores'].forEach(function (afterReferences) {

                                                if (afterReferences['posterior'] != undefined) {
                                                    afterReferences['posterior'].forEach(function (afterReference) {
                                                        var afterReferenceData = {
                                                            'reference': afterReference['$']['referencia'],
                                                            'order': afterReference['$']['orden'],
                                                            'text': afterReference['texto']
                                                        };

                                                        boe_item['references']['after'].push(afterReferenceData);
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }

                                // Send downloaded data to content queue
                                amqp.connect('amqp://localhost').then(function (conn) {
                                    return when(conn.createChannel().then(function (ch) {

                                        // Send data to the queue
                                        var parsedItemQueue = 'boe.parsed_items';
                                        var ok = ch.assertQueue(
                                            parsedItemQueue,
                                            {durable: true}
                                        );

                                        console.log(boe_item);
                                        ok.then(function (_qok) {
                                            ch.sendToQueue(parsedItemQueue, new Buffer(JSON.stringify(boe_item)));
                                            console.log("Sent parsed item: " + boe_item['id']);
                                        });
                                    }));
                                });
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
