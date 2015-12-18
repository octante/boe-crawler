/**
 * Return value from a field in metadata. If not return an empty array.
 *
 * @param data  Boe item data
 * @param field Field name
 *
 * @returns Array
 */
exports.getMetadataValue = function(data, field) {

    if (data[field] != undefined) {
        return data[field][0];
    }

    return [];
};

/**
 * Return references from boe item. References are before and next boe. Include references
 * in boe_item hash.
 *
 * @param analysis Analysis data
 * @param boe_item Boe item data
 *
 * @returns Array
 */
exports.getReferences = function(analysis, boe_item) {

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
                        word = '';
                        if (beforeReference['palabra'] != undefined) {
                            var word = beforeReference['palabra'][0]['_'] + " ";
                        }
                        var beforeReferenceData = {
                            'reference': beforeReference['$']['referencia'],
                            'order': beforeReference['$']['orden'],
                            'text': word + beforeReference['texto']
                        };

                        boe_item['references']['before'] = beforeReferenceData;
                    });
                }
            });
        }

        if (reference['posteriores'] != undefined) {
            reference['posteriores'].forEach(function (afterReferences) {

                if (afterReferences['posterior'] != undefined) {
                    afterReferences['posterior'].forEach(function (afterReference) {
                        word = '';
                        if (afterReference['palabra'] != undefined) {
                            var word = afterReference['palabra'][0]['_'] + " ";
                        }
                        var afterReferenceData = {
                            'reference': afterReference['$']['referencia'],
                            'order': afterReference['$']['orden'],
                            'text': word + afterReference['texto']
                        };

                        boe_item['references']['after'] = afterReferenceData;
                    });
                }
            });
        }
    });

    return boe_item;
};

/**
 * Return alerts from boe item. Alerts has an order an a code. Include references
 * in boe_item hash.
 *
 * @param analysis Analysis data
 * @param boe_item Boe item data
 *
 * @returns Array
 */
exports.getAlerts = function(analysis, boe_item) {

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

    return boe_item;
};

/**
 * Return subjects from boe item. Subjects has a code and an order.
 *
 * @param analysis Analysis data
 * @param boe_item Boe item data
 *
 * @returns Array
 */
exports.getSubjects = function(analysis, boe_item) {

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

    return boe_item;
};

/**
 * Return notes from from boe item. Notes has a code and an order.
 *
 * @param analysis Analysis data
 * @param boe_item Boe item data
 * @returns Array
 */
exports.getNotes = function(analysis, boe_item) {

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

    return boe_item;
};

/**
 * Return date with the format Y-M-D.
 *
 * @param date Date
 *
 * @returns Date|String
 */
exports.getDate = function(date) {

    if (date != '') {
        var year = date.substring(0, 4);
        var month = date.substring(4, 6);
        var day = date.substring(6, 8);

        return new Date(year + "-" + month + "-" + day);
    } else {
        return '';
    }
};

/**
 * Return text as a formatted string.
 *
 * @param text
 * @param result
 *
 * @returns string
 */
exports.getText = function(raw_boe) {
    var begin = raw_boe.search('</analisis>');
    var end = raw_boe.search('</documento>');

    var text = raw_boe.substr(begin, end - begin);
    text = text.replace('</analisis>', '').replace('<texto>', '').replace('</texto>', '').replace('\\n', '');

    return text;
};

/**
 * Return parsed data from a boe item.
 *
 * @param metadata Metadata data
 * @param boe_item Boe item data
 *
 * @returns Array
 */
exports.getGeneralData = function(metadata, boe_item) {

    boe_item['parsed_at'] = new Date().toISOString();
    boe_item['department'] = {
        'code': metadata['departamento'][0]['$']['codigo'],
        'name': metadata['departamento'][0]['_']
    };

    boe_item['id'] = this.getMetadataValue(metadata, 'identificador');
    boe_item['diary_num'] = this.getMetadataValue(metadata, 'diario_numero');

    boe_item['section'] = this.getMetadataValue(metadata, 'seccion');
    boe_item['subsection'] = this.getMetadataValue(metadata, 'subseccion');
    boe_item['oficial_number'] = this.getMetadataValue(metadata, 'numero_oficial');
    boe_item['ad_num'] = this.getMetadataValue(metadata, 'numero_anuncio');

    if (metadata['rango'] != undefined) {
        boe_item['range'] = {
            'code': metadata['rango'][0]['$']['codigo'],
            'name': metadata['rango'][0]['_']
        };
    }

    boe_item['image_letter'] = this.getMetadataValue(metadata, 'letra_imagen');
    boe_item['first_page'] = this.getMetadataValue(metadata, 'pagina_inicial');
    boe_item['last_page'] = this.getMetadataValue(metadata, 'pagina_final');

    boe_item['disposition_date'] = this.getDate(this.getMetadataValue(metadata, 'fecha_disposicion'));
    boe_item['publication_date'] = this.getDate(this.getMetadataValue(metadata, 'fecha_publicacion'));
    boe_item['validity_date'] = this.getDate(this.getMetadataValue(metadata, 'fecha_vigencia'));
    boe_item['abolition_date'] = this.getDate(this.getMetadataValue(metadata, 'fecha_derogacion'));
    boe_item['suplement_image_letter'] = this.getMetadataValue(metadata, 'suplemento_letra_imagen');
    boe_item['suplement_first_page'] = this.getMetadataValue(metadata, 'suplemento_pagina_inicial');
    boe_item['suplement_last_page'] = this.getMetadataValue(metadata, 'suplemento_pagina_final');
    boe_item['legislative_status'] = this.getMetadataValue(metadata, 'estatus_legislativo');

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

    boe_item['judicially_annulled'] = this.getMetadataValue(metadata, 'judicialmente_anulada');
    boe_item['exhausted_force'] = this.getMetadataValue(metadata, 'vigencia_agotada');
    boe_item['abolition_status'] = this.getMetadataValue(metadata, 'estatus_derogacion');
    boe_item['url_epub'] = this.getMetadataValue(metadata, 'url_epub');
    boe_item['url_pdf'] = this.getMetadataValue(metadata, 'url_pdf');

    // @todo Is not saved correctly
    boe_item['url_pdf_catalan'] = this.getMetadataValue(metadata, 'url_pdf_catalan');
    boe_item['url_pdf_euskera'] = this.getMetadataValue(metadata, 'url_pdf_euskera');
    boe_item['url_pdf_gallego'] = this.getMetadataValue(metadata, 'url_pdf_gallego');
    boe_item['url_pdf_valenciano'] = this.getMetadataValue(metadata, 'url_pdf_valenciano');

    return boe_item;
};