const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('c:\\Users\\asus\\Code_folder\\Project_code\\biharyaatra-main\\Biharyaatra\\bihar-yaatra\\BiharYaatra_Architecture.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(function(error) {
    console.error(error);
});
