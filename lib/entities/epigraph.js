var method = Epigraph.prototype;

function Epigraph(name) {
    this.name = name;
    this.items = [];
}

method.getName = function() {
    return this.name;
};

method.addItem = function(item) {
    this.items.push(item);
};

method.getItems = function() {
    return this.items;
};

createEpigraph = function create(data) {
    return new Epigraph(data.name);
};

module.exports = Epigraph;