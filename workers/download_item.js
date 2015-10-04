var amqp = require('amqplib');
var when = require('when');
var http = require('http');
var parseString = require('xml2js').parseString;

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

                // Download page and save content to another rabbit queue
                //var url = "http://boe.es" + boe_item['urlXml'];

                var url = "http://boe.es/diario_boe/xml.php?id=BOE-A-2015-9550";

                http.get(url, function(response) {
                    if (response.statusCode == '200') {

                        // Get data
                        var boeData = '';
                        response.on('data', function (chunk) {

                            boeData += chunk.toString();
                        });

                        response.on('end', function(){
                            parseString(boeData, function (err, result) {
                                var parsedData = result;

                                var metadata = parsedData['documento']['metadatos'][0];

                                boe_item['parsed_at'] = new Date().toISOString();
                                boe_item['department']['code'] = metadata['departamento'][0]['$']['codigo'];
                                boe_item['id'] = metadata['identificador'][0];
                                boe_item['diary_num'] = metadata['diario_numero'][0];
                                boe_item['section'] = metadata['seccion'][0];
                                boe_item['subsection'] = metadata['subseccion'][0];
                                boe_item['oficial_number'] = metadata['numero_oficial'][0];

                                if (metadata['numero_anuncio'] != undefined) {
                                    boe_item['ad_num'] = metadata['numero_anuncio'][0];
                                }

                                if (metadata['rango'] != undefined) {
                                    boe_item['range'] = {
                                        'code': metadata['rango'][0]['$'],
                                        'name': metadata['rango'][0]['_']
                                    };
                                }

                                boe_item['image_letter'] = metadata['letra_imagen'][0];
                                boe_item['initial_page'] = metadata['pagina_inicial'][0];
                                boe_item['end_page'] = metadata['pagina_final'][0];

                                boe_item['disposition_date'] = metadata['fecha_disposicion'][0];
                                boe_item['publication_date'] = metadata['fecha_publicacion'][0];
                                boe_item['vigency_date'] = metadata['fecha_vigencia'][0];
                                boe_item['abolition_date'] = metadata['fecha_derogacion'][0];

                                boe_item['suplement_image_letter'] = metadata['suplemento_letra_imagen'][0];
                                boe_item['suplement_initial_page'] = metadata['suplemento_pagina_inicial'][0];
                                boe_item['suplement_final_page'] = metadata['suplemento_pagina_final'][0];

                                boe_item['legislative_status'] = metadata['estatus_legislativo'][0];
                                boe_item['legislative_origin'] = {
                                    'code': metadata['origen_legislativo'][0]['$']['codigo'],
                                    'name': metadata['origen_legislativo'][0]['_']
                                };

                                boe_item['consolidation_status'] = {
                                    'code': metadata['estado_consolidacion'][0]['$']['codigo'],
                                    'name': metadata['estado_consolidacion'][0]['_']
                                };

                                boe_item['judicially_annulled'] = metadata['judicialmente_anulada'][0];
                                boe_item['exhausted_force'] = metadata['vigencia_agotada'][0];
                                boe_item['abolition_status'] = metadata['estatus_derogacion'][0];

                                boe_item['url_epub'] = metadata['url_epub'][0];
                                boe_item['url_pdf'] = metadata['url_pdf'][0];

                                // Is not saved correctly
                                boe_item['url_pdf_catalan'] = metadata['url_pdf_catalan'][0];
                                boe_item['url_pdf_euskera'] = metadata['url_pdf_euskera'][0];
                                boe_item['url_pdf_catalan'] = metadata['url_pdf_gallego'][0];
                                boe_item['url_pdf_valenciano'] = metadata['url_pdf_valenciano'][0];

                                boe_item['text'] = parsedData['documento']['texto'][0];

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
