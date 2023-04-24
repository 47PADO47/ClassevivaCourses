const fs = require('fs');
const path = require('path');
const { Base64 } = require('./utils');

const discordWebhook = process.env.DISCORD_WEBHOOK;
const staticHost = process.env.STATIC_HOST;

// Decode secrets from Base64
const config = {
    discord_webhook: Base64.decode(discordWebhook),
    static_host: Base64.decode(staticHost),
};

const file = path.join(process.cwd(), 'dist', 'config.js');
var content = fs.readFileSync(file, 'utf-8');

const toReplace = Object.keys(config);
for (const replace of toReplace) {
    console.log('[+]', `Replacing ${replace}`);
    content = content.replace(`{${replace}}`, config[replace]);
};

fs.writeFileSync(file, content);
console.log('[+]', 'Done');