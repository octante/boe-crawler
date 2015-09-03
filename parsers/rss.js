var context = require('rabbit.js').createContext('amqp://localhost');

var sub = context.socket('SUBSCRIBE');
sub.connect('feeds');

console.dir('waiting for feeds...');