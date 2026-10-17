const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

test('CMS content writes and image uploads reject unauthenticated requests', async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  try {
    const contentResponse = await fetch(
      `http://127.0.0.1:${port}/api/cms/hero`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: { heading: 'unauthorized' } }),
      }
    );
    const imageResponse = await fetch(
      `http://127.0.0.1:${port}/api/cms/images`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'image/png' },
        body: Buffer.from('not-an-image'),
      }
    );

    assert.equal(contentResponse.status, 401);
    assert.equal(imageResponse.status, 401);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});
