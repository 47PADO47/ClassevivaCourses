const fs = require('fs');
const path = require('path');
const { Base64, loadEnv } = require('./utils');

(async () => {
    await loadEnv();
    
    const httpPath = Base64.decode(process.env.STATIC_HOST) + 'dist/';
    const file = path.join(process.cwd(), 'dist', 'loader.js');

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
    const awaiter = data.split('\n').filter((_, i) => i<9).join('\n').length;
    let newData = data.slice(0, awaiter) + `\n(async () => {\n`;

    for (const filename of imports) {
        newData += `\nif (!this.${filename.split('/').pop()}) await fetchImport('${httpPath}${formatName(filename)}');\n`;
        data = data.replace(importRegex, '');
    };
    newData += `\n})();\n`;

    newData += data.slice(awaiter);

    //data = data.split('\n').filter(x => x.length > 0).join('');
    data.length--;
    fs.writeFileSync(file, newData);

    console.log('Finished');
})();

function replaceAll(str, search, replace) {
    while (search.test(str)) str = str.replace(search, replace);
    return str;
}

function formatName(name) {
    let str = name;
    if (!name.endsWith('.js')) str += '.js';
    if (name.startsWith('./')) str = str.slice(2);
    return str;
}