var method = Suplement.prototype;

function Suplement(description, urlPdf) {
    this.description = description;
    this.urlPdf = urlPdf;
}

method.getDescription = function() {
    return this.description;
};

method.getUrlPdf = function() {
    return this.urlPdf;
};

createSuplement = function create(data) {
    return new Suplement(
        data.description,
        data.urlPdf
    );
};

module.exports = Suplement;