module.exports = {
    parse: function (parsedData){

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

        return items;
    }
};