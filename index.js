const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const pug = require('pug');

const app = new Hono();
app.get('/', (c) => c.html(pug.compileFile('./views/index.pug')()));

const port = process.env.PORT || 8000;
console.log(`${port}番ポートでサーバー起動中`);
serve({ fetch: app.fetch, port });