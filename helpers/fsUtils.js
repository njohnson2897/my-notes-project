const fs = require('fs')
const util = require('util');

// got these three helper functions from the module 11 mini project
const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, '\t'), (err) =>
    err ? console.error(err) : console.log(`\nData written  to ${destination}`));

const readAndAppend = (content, file)  => {
    fs.readFile(file, 'utf-8', (err, data) =>  {
    if (err)  {
        console.error(err);
    } else {
        const parsedData =  JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
    };
    });
};


module.exports = {readFromFile, readAndAppend, writeToFile}