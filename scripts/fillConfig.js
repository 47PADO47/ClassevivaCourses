const fs = require('fs');
const path = require('path');
const { Base64 } = require('./utils');

const config = {
    discord_webhook: process.env.DISCORD_WEBHOOK,
    static_host: process.env.STATIC_HOST,
}

const file = path.join(process.cwd(), 'dist', 'config.js');
var content = fs.readFileSync(file, 'utf-8');

const toReplace = Object.keys(config);
for (const replace of toReplace) {
    console.log('[+]', `Replacing ${replace}`);
    content = content.replace(`{${replace}}`, Base64.decode(config[replace]));
};

fs.writeFileSync(file, content);
console.log('[+]', 'Done');

console.log(fs.readFileSync(file, 'utf-8'));