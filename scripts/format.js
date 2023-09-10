const fs = require('fs');
const path = require('path');
const { Base64, loadEnv } = require('./utils');

(async () => {
    await loadEnv();
    const isProd = process.env.NODE_ENV === 'production';
    
    const httpPath = Base64.decode(process.env.STATIC_HOST) + 'dist/';
    const file = path.join(process.cwd(), 'dist', 'loader.js');

    if (!isProd) console.log('[+]', `HTTP path: ${httpPath}`);

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

        console.log('[i]', `Found import "${str}"`);
        imports.push(str);
    }
    console.log('[+]', `Found a total of ${imports.length} imports`);

    // Replace each import statement with the fetchImport function
    const awaiter = data.split('\n').filter((_, i) => i<9).join('\n').length;
    let newData = data.slice(0, awaiter) + `\n(async () => {\n`;

    for (const filename of imports) {
        newData += `\nif (!this.${filename.split('/').pop()}) await fetchImport('${httpPath}${formatName(filename)}');\n`;
        data = data.replace(importRegex, '');
    };
    newData += `\n})();\n`;
    newData += data.slice(awaiter);
    
    data.length--;
    fs.writeFileSync(file, newData);

    console.log('[+]', `Replaced imports, suggested waitSeconds=${imports.length/2}`);

    const indexPath = path.join(process.cwd(), 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');

    if (isProd) {
        const buildTime = new Date().toUTCString();

        fs.writeFileSync(indexPath, html.replace('{{buildTime}}', buildTime));
        console.log('[+]', `Updated build time to ${buildTime}`);
    }
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