var method = Department.prototype;

function Department(name) {
    this.name = name;
    this.epigraphs = [];
    this.items = [];
}

method.addEpigraph = function(epigraph){
    this.epigraphs.push(epigraph);
};

method.addItem = function(item) {
    this.items.push(item);
};

method.getName = function() {
    return this.name;
};

method.getEpigraphs = function() {
    return this.epigraphs;
};

method.getItems = function() {
    return this.items;
};

createDepartment = function create(data) {
    return new Department(data.name);
};

module.exports = Department;
