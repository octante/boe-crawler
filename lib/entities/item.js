var method = Item.prototype;

function Item(id, title) {
    this.id = id;
    this.title = title;
    this.suplements = [];
}

method.setUrlPdf = function(urlPdf) {
    this.urlPdf = urlPdf;
};

method.setUrlHtml = function(urlHtml) {
    this.urlHtml = urlHtml;
};

method.setUrlXml = function(urlXml) {
    this.urlXml = urlXml;
};

method.addSuplement = function(suplement) {
    this.suplements.push(suplement);
};

method.getId = function() {
    return this.id;
};

method.getTitle = function() {
    return this.title;
};

method.getUrlPdf = function() {
    return this.urlPdf;
};

method.getUrlHtml = function() {
    return this.urlHtml;
};

method.getUrlXml = function() {
    return this.urlXml;
};

method.getSuplements = function() {
    return this.suplements;
};

createItem = function create(data) {
    return new Item(
        data.id,
        data.title
    );
};

module.exports = Item;
