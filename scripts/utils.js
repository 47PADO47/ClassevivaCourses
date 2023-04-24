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

module.exports = {
    Base64,
}