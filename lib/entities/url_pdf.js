var method = UrlPdf.prototype;

function UrlPdf(
    szBytes,
    szKbytes,
    url
) {
    this.szBytes = szBytes;
    this.szKbytes = szKbytes;
    this.url = url;
}

method.getSZBytes = function() {
    return this.szBytes;
};

method.getSZBytes = function() {
    return this.szKbytes();
};

method.getUrl = function() {
    return this.url;
};

createUrlPdf = function create(data) {
    return new UrlPdf(
        data.szBytes,
        data.szKbytes,
        data.url
    );
};

module.exports = UrlPdf;