const express = require('express');
const { fetch } = require('undici');
const port = 3003;
const host = 'https://web.spaggiari.eu';

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

app.all('*', async (req, res) => {
    console.log('[INFO]', req.method, req.url, req.headers['content-type']);

    if (req.url === '/') return res.set('Access-Control-Allow-Origin', '*').status(200).send({
        message: 'Ok',
    });

    const opts = {
        method: req.method,
        headers: {
            Cookie: req.headers['cookie'],
            'User-Agent': req.headers['user-agent'],
            'Content-Type': req.headers['content-type'],
        },
    };

    if (req.method !== 'GET' && req.body) {
        try {
            if (opts.headers['Content-Type'] === 'application/json') opts.body = JSON.parse(req.body);
            else if (opts.headers['Content-Type'] === 'application/x-www-form-urlencoded') opts.body = new URLSearchParams(req.body).toString();
            else opts.body = req.body;
        } catch (error) {
            opts.body = req.body;
        }
    };
    const response = await fetch(host + req.url, opts);

    res.header('Set-Cookie', response.headers.get('Set-Cookie'));
    res.set("Access-Control-Allow-Origin", '*');
    res.set("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS,PUT");
    res.set("Access-Control-Max-Age", "86400",);

    const bodyOpts = {
        body: await response.text(),
        json: false,
    };
    try {
        bodyOpts.body = JSON.parse(bodyOpts.body);
        bodyOpts.json = true;
    } catch (error) {
        bodyOpts.json = false;
    }
    if (bodyOpts.json) return res.json(bodyOpts.body);

    return res.send(bodyOpts.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
