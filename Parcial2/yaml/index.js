const fs = require('fs');
const yaml = require('yaml');
const path = require('path');

let objetoYaml = fs.readFileSync(path.join(__dirname, 'objeto.yaml'), 'utf8');
let objetoJSon = yaml.parse(objetoYaml);

console.log(objetoYaml);
console.log(typeof objetoYaml);

console.log(objetoJSon);
console.log(typeof objetoJSon);