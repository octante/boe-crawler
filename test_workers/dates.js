
var intDate = 20100728;
var date = intDate.toString();

var year = date.substring(0, 4);
var month = date.substring(4, 6);
var day = date.substring(6,8);

console.log(year);
console.log(month);
console.log(day);

var d = new Date(year+"-"+month+"-"+day);
console.log(d);