const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { getEdBug } = require('./wiki.js');
const pug = require('pug');

const app = new Hono();

// トップページ
app.get('/', (c) => c.html(pug.compileFile('./views/index.pug')()));

// POSTで学歴取得
app.post('/get-education', async (c) => {
  const form = await c.req.formData();
  const name = form.get('name')?.trim();

  if (!name) return c.json({ error: '名前が入力されていません' }, 400);

  try {
    const education = await getEdBug(name);
    return c.json({
      name,
      education: education || null
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: '学歴取得に失敗しました' }, 500);
  }
});

//API
app.get('/api', async(c) => {
  const nameValue = c.req.query('name');
  if (!nameValue) {
    return c.json({ error: 'nameを指定してください'}, 400);
  };
  const result = await getEdBug(nameValue);
  return c.json({[nameValue]:result});
});

const port = process.env.PORT || 8000;
console.log(`${port}番ポートでサーバー起動中`);
serve({ fetch: app.fetch, port });