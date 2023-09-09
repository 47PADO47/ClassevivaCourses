const fs = require('fs');
const path = require('path');

class Base64 {
    static encode(str) {
      const buff = Buffer.from(str, 'utf-8');
      return buff.toString('base64');
    }
  
    static decode(str) {
      const buff = Buffer.from(str, 'base64');
      return buff.toString('utf-8');
    }
}

const exists = (path) => new Promise((resolve) => fs.access(path, fs.constants.F_OK, err => resolve(!err)));

async function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');

  if (!await exists(envPath)) return {};

  const envFile = fs.readFileSync(envPath, 'utf8');
  const envLines = envFile.split('\n');

  for (const line of envLines) {
    const [key, value] = line.split('=');
    process.env[key.trim()] = Base64.encode(value.trim());
  };
  
  console.log('[+]', `Loaded ${envLines.length} .env properties`);
  return process.env;
}

module.exports = {
    Base64,
    loadEnv,
}