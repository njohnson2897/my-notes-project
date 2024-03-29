const fs = require('fs')
const util = require('util');

// got this syntax from the module 11 mini project
const readFromFile = util.promisify(fs.readFile);


module.exports = {readFromFile}