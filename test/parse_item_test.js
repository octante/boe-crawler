var should = require('should');
var parse_item = require("../modules/parse_item");

describe('ParseBoeItem', function() {
    describe('#getMetadataValue()', function () {
        it('should return metadata when is defined', function () {
            var metadata_test = {'fieldName': {'0': 'fieldValue'}};
            var metadata_value = parse_item.getMetadataValue(metadata_test, 'fieldName');
            metadata_value.should.be.exactly('fieldValue');
        });
    });

    describe('#GetReferences', function() {
        it('should return "anteriores" and "posteriores" references if exists', function() {
            var analysis_test = require('../fixtures/boe_item_complete.json')['documento']['analisis'][0];
            var references_value = parse_item.getReferences(analysis_test, {});
            references_value['references']['before']['order'].should.be.exactly('3060');
            references_value['references']['before']['reference'].should.be.exactly('BOE-A-1998-10407');
            references_value['references']['before']['text'].should.be.exactly('DE CONFORMIDAD con el art. 4 de la Ley 13/1998, de 4 de mayo');

            references_value['references']['after']['order'].should.be.exactly('3061');
            references_value['references']['after']['reference'].should.be.exactly('BOE-A-1998-10406');
            references_value['references']['after']['text'].should.be.exactly('DE CONFORMIDAD con el art. 4 de la Ley 13/1998, de 5 de mayo');
        })
    });

    describe('#getAlerts', function() {
        it('Should return alerts if exists', function() {
            var analysis_test = require('../fixtures/boe_item_complete.json')['documento']['analisis'][0];
            var alerts_value = parse_item.getAlerts(analysis_test, {});
            alerts_value['alerts'][0]['code'].should.be.exactly('141');
            alerts_value['alerts'][0]['order'].should.be.exactly('1');
            alerts_value['alerts'][0]['name'].should.be.exactly('Concursos de personal público');
        })
    });

    describe('#getSubjects', function() {
        it('Should return subjects if exists', function() {
            var analysis_test = require('../fixtures/boe_item_complete.json')['documento']['analisis'][0];
            var subjects_value = parse_item.getSubjects(analysis_test, {});
            subjects_value['subjects'][0]['code'].should.be.exactly('3511');
            subjects_value['subjects'][0]['order'].should.be.exactly('1');
            subjects_value['subjects'][0]['name'].should.be.exactly('Expendedurías de Tabaco y Efectos Timbrados');

            subjects_value['subjects'][1]['code'].should.be.exactly('5665');
            subjects_value['subjects'][1]['order'].should.be.exactly('2');
            subjects_value['subjects'][1]['name'].should.be.exactly('Precios');

            subjects_value['subjects'][2]['code'].should.be.exactly('6819');
            subjects_value['subjects'][2]['order'].should.be.exactly('3');
            subjects_value['subjects'][2]['name'].should.be.exactly('Tabaco');
        })
    });

    describe('#getNotes', function() {
       it('Should return notes if exists', function() {
           var analysis_test = require('../fixtures/boe_item_complete.json')['documento']['analisis'][0];
           var notes_value = parse_item.getNotes(analysis_test, {});
           notes_value['notes'][0]['code'].should.be.exactly('10');
           notes_value['notes'][0]['order'].should.be.exactly('200');
           notes_value['notes'][0]['name'].should.be.exactly('Entrada en vigor el 3 de febrero de 2015.');
       })
    });

    describe('#getText', function() {
        it('Should return formatted text', function() {
            var text_test = require('../fixtures/raw_item.json')['data'];
            var text_value = parse_item.getText(text_test);
            var cleared_text = "<p class=\"parrafo\">Por Orden INT/1659/2010, de 9 de junio, se convocan pruebas selectivas para el ingreso, por el sistema general de acceso libre, en el Cuerpo de Ayudantes T�cnicos Sanitarios de Instituciones Penitenciarias (�Bolet�n Oficial del Estado� de 22 de junio).</p>\n    <p class=\"parrafo\">Expirado el plazo de presentaci�n de solicitudes, se declara aprobada la lista provisional de admitidos, de las pruebas de referencia, en el Anexo que se adjunta.</p>\n    <p class=\"parrafo\">Al mismo tiempo se establece que:</p>\n    <p class=\"parrafo_2\">Primero.�Los Anexos I, II y III, ser�n expuesto en las Delegaciones y Subdelegaciones del Gobierno, en la Secretar�a General de Instituciones Penitenciarias del Ministerio del Interior, en la Secretaria de Estado para la Funci�n P�blica y en el Centro de Informaci�n Administrativa del Ministerio de la Presidencia, y en las p�ginas Web del Ministerio del Interior (www.mir.es) y de la Secretar�a General de Instituciones Penitenciarias (www.institucionpenitenciaria.es). Los Anexos II y III ser�n publicados en el �Bolet�n Oficial del Estado�.</p>\n    <p class=\"parrafo\">Segundo.�El primer ejercicio de la fase de oposici�n ser� el d�a 2 de octubre de 2010, a las 09.00 horas, en la Escuela T�cnica Superior de Ingenieros de Telecomunicaciones, sita en la Avenida de la Complutense n� 30 de la Ciudad Universitaria de Madrid. Los aspirantes concurrir�n a la prueba provistos del documento nacional de identidad o pasaporte, y bol�grafo.</p>\n    <p class=\"parrafo\">Tercero.�De conformidad con lo previsto en el art�culo 71 de la Ley 30/1992, de R�gimen Jur�dico de las Administraciones P�blicas y Procedimiento Administrativo Com�n, modificada por Ley 4/1999, de 13 de enero, se concede a los aspirantes un plazo de diez d�as h�biles, contados a partir de la publicaci�n de esta resoluci�n en el Bolet�n Oficial del Estado, para la subsanaci�n de errores u omisiones que hubiese en la citada lista.</p>\n    <p class=\"parrafo\">Cuarto.�Los aspirantes que dentro del plazo se�alado no subsanen el error u omisi�n, justificando su derecho a estar incluidos en la relaci�n de admitidos, ser�n definitivamente excluidos de la realizaci�n de las pruebas selectivas.</p>\n    <p class=\"parrafo\">Quinto.�Frente a los actos de exclusi�n definitivos dictados por la autoridad convocante, podr�n los aspirantes interponer potestativamente recurso de reposici�n ante esta autoridad en el plazo de un mes, contado a partir del d�a siguiente al de la publicaci�n de la Resoluci�n, conforme lo dispuesto en la Ley 30/1992, de 26 de noviembre, de R�gimen Jur�dico de las Administraciones P�blicas y del Procedimiento Administrativo, o ser impugnada directamente ante los Juzgados Centrales de lo Contencioso-Administrativo, pudiendo interponerse en este caso recurso contencioso-administrativo, en el plazo de dos meses a partir del d�a siguiente de la publicaci�n de la Resoluci�n, conforme a lo previstos en la Ley 29/1998, de 13 de julio, reguladora de la Jurisdicci�n Contencioso-Administrativa,</p>\n    <p class=\"parrafo_2\">Madrid, 6 de agosto de 2010.�El Ministro del Interior, P.D. (Orden INT/50/2010, de 12 de enero), el Director General de Gesti�n de Recursos de Instituciones Penitenciarias, Antonio Puig Renau.</p>\n    <p class=\"anexo_num\">ANEXO II</p>\n    <p class=\"anexo_tit\">Lista de excluidos</p>\n    <p class=\"centro_cursiva\">C. Ayudantes T�cnicos Sanitarios</p>\n    <table class=\"tabla_ancha\">\n      <tr>\n        <td>\n          <p class=\"cabeza_tabla\">N. Orden</p>\n        </td>\n        <td>\n          <p class=\"cabeza_tabla\">Instancia</p>\n        </td>\n        <td>\n          <p class=\"cabeza_tabla\">Apellidos y Nombre</p>\n        </td>\n        <td>\n          <p class=\"cabeza_tabla\">DNI</p>\n        </td>\n        <td>\n          <p class=\"cabeza_tabla\">F. Nacim.</p>\n        </td>\n        <td>\n          <p class=\"cabeza_tabla\">Minusval�a</p>\n        </td>\n        <td>\n          <p class=\"cabeza_tabla\">Exclusiones</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">1</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">302</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">ARAUZ CARMONA, LUISA MARIA</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">77534758</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">2</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">310</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">BLANCO VARO, DANIEL</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">44968927</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">3</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">309</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">CARRILLO LORENZO, TOMAS</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">74695234</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">4</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">312</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">CASTILLO MU�OZ, INES</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">75255007</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">5</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">307</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">GARCIA RAMOS, LAURA</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">45684194</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">6</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">317</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">GODOY CHINCHILLA, OSCAR ANTONIO</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">44584431</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">24/04/1978</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">1</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">7</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">314</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">JANEIRO SANCHEZ, AURORA</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">44038230</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">8</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">305</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">LUJAN BELTRAN, M. INMACULADA</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">44510375</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">9</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">318</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">MALAGON SELMA, JOSE MANUEL</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">48410241</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">08/08/1988</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">7</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">313</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">MONTERROSO MOLINA, LAURA</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">78968371</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">11</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">304</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">NARBONA LOBATO, M. CARMEN</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">49028439</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">12</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">316</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">PRADO RODRIGUEZ-BARBERO, MONTSERRAT</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">05693182</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">13</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">319</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">ROMERO PAREJA, PATRICIA</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">05306862</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">14</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">303</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">SERRANO ORTEGA, ALONSO JESUS</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">76257840</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">15</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">311</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">TAPIA MALLO, DANIEL</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">02649791</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">68</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <p class=\"cuerpo_tabla_der\">16</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">308</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_izq\">VICENTE GONZALEZ, JOSEFA</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">29194195</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\">01/01/2010</p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_centro\"> � </p>\n        </td>\n        <td>\n          <p class=\"cuerpo_tabla_der\">10</p>\n        </td>\n      </tr>\n    </table>\n    <p class=\"anexo_num\">ANEXO III</p>\n    <p class=\"anexo_tit\">Causa de exclusi�n</p>\n    <p class=\"centro_cursiva\">Cuerpo Ayudantes T�cnicos Sanitarios de Instituciones Penitenciarias</p>\n    <p class=\"parrafo\">1. Instancia Fuera de plazo.</p>\n    <p class=\"parrafo\">2. Falta de pago de las tasas de los derechos de examen.</p>\n    <p class=\"parrafo\">3. Falta certificado de demanda de empleo, o certificado incompleto.</p>\n    <p class=\"parrafo\">4. Falta firma en solicitud.</p>\n    <p class=\"parrafo\">5. Falta declaraci�n jurada de no percibir rentas superiores, en c�mputo mensual al Salario M�nimo Interprofesional.</p>\n    <p class=\"parrafo\">6. Falta certificado de no haber rechazado ofertas de empleo adecuada, ni que se haya negado a participar en acciones de promoci�n, formaci�n o reconversiones profesionales.</p>\n    <p class=\"parrafo\">7. Falta justificaci�n familia numerosa.</p>\n    <p class=\"parrafo\">8. Falta antig�edad requerida en INEM.</p>\n    <p class=\"parrafo\">9. Modelo de Solicitud no original.</p>\n    <p class=\"parrafo\">10. Edad insuficiente/omisi�n fecha nacimiento.</p>\n    <p class=\"parrafo\">11. No justifica nacionalidad espa�ola.</p>\n  ";
            text_value.should.be.exactly(cleared_text);
        })
    });

    describe('#getGeneralData', function() {
        it('Should return data', function() {
            var metadata_test = require('../fixtures/boe_item_complete.json')['documento']['metadatos'][0];
            var data_values = parse_item.getGeneralData(metadata_test, {});
            data_values['department']['code'].should.be.exactly('1820');
            data_values['department']['name'].should.be.exactly('Consejo General del Poder Judicial');

            data_values['id'].should.be.exactly('BOE-A-2015-9498');
            data_values['diary_num'].should.be.exactly('209');
            data_values['section'].should.be.exactly('2');
            data_values['subsection'].should.be.exactly('A');
            data_values['oficial_number'].should.be.exactly('1');
            data_values['ad_num'].should.be.exactly('10');

            data_values['range']['code'].should.be.exactly('1350');
            data_values['range']['name'].should.be.exactly('Orden');

            data_values['image_letter'].should.be.exactly('A');

            data_values['first_page'].should.be.exactly('77479');
            data_values['last_page'].should.be.exactly('77488');

            data_values['disposition_date'].should.be.eql(new Date('2015-07-28'));
            data_values['publication_date'].should.be.eql(new Date('2015-09-01'));
            data_values['validity_date'].should.be.eql(new Date('2015-09-02'));
            data_values['abolition_date'].should.be.eql(new Date('2015-09-03'));

            data_values['suplement_image_letter'].should.be.exactly('A');
            data_values['suplement_first_page'].should.be.exactly('1');
            data_values['suplement_last_page'].should.be.exactly('2');
            data_values['legislative_status'].should.be.exactly('S');

            data_values['consolidation_status']['code'].should.be.exactly('1');
            data_values['consolidation_status']['name'].should.be.exactly('Nombre estado consolidación');

            data_values['judicially_annulled'].should.be.exactly('N');
            data_values['exhausted_force'].should.be.exactly('N');
            data_values['abolition_status'].should.be.exactly('N');

            data_values['url_epub'].should.be.exactly('/boe/dias/2015/09/01/pdfs/BOE-A-2015-9498.pub');
            data_values['url_pdf'].should.be.exactly('/boe/dias/2015/09/01/pdfs/BOE-A-2015-9498.pdf');

            data_values['url_pdf_catalan'].should.be.exactly('url_pdf_catalan');
            data_values['url_pdf_euskera'].should.be.exactly('url_pdf_euskera');
            data_values['url_pdf_gallego'].should.be.exactly('url_pdf_gallego');
            data_values['url_pdf_valenciano'].should.be.exactly('url_pdf_valenciano');
        })
    });
});
