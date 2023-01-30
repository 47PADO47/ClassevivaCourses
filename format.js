const fs = require('fs');
const path = require('path');

const httpPath = process.env.httpPath || 'https://webcvv.pages.dev/dist/';
const file = path.join(__dirname, 'dist', 'loader.js');

let data = fs.readFileSync(file, 'utf-8');

// Find all import statements in the logger.js file
const importRegex = new RegExp('import[{},a-zA-Z\\s]+ from .*;');
const regexG = new RegExp('import[{},a-zA-Z\\s]+ from .*;', 'g');
let imports = [];
let match;

while ((match = regexG.exec(data)) !== null) {
    let str = match[0];
    str = str.split('from ').pop();
    str = str.replace(';', '');

    str = replaceAll(str, new RegExp("'"), '');
    str = replaceAll(str, new RegExp('"'), '');

    imports.push(str);
}
console.log(imports);

// Replace each import statement with the fetchImport function
for (const filename of imports) {
    data = data.replace(importRegex, `(async () => { if (this.${filename.split('.')[0]}) return; await fetchImport('${httpPath}${filename.endsWith('.js') ? filename : filename + '.js'}');console.log('[+]', 'Loaded file ${filename}')})();\n`);
}

//data = data.split('\n').filter(x => x.length > 0).join('');
data.length--;
fs.writeFileSync(file, data);

console.log('Finished');

function replaceAll(str, search, replace) {
    while (search.test(str)) str = str.replace(search, replace);
    return str;
}