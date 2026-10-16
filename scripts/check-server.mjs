import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import path from 'node:path';

test('production server serves the app and saves custom questions without replacing reviewed source', async () => {
  const root = process.cwd();
  const temp = await mkdtemp(path.join(root, '.server-test-'));
  const probe = createServer();
  await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  let child;
  try {
    await mkdir(path.join(temp, 'dist'));
    await mkdir(path.join(temp, 'src/data'), { recursive: true });
    await copyFile(path.join(root, 'server.js'), path.join(temp, 'server.mjs'));
    await copyFile(path.join(root, 'dist/index.html'), path.join(temp, 'dist/index.html'));
    const source = path.join(temp, 'src/data/driveQuestions.ts');
    await writeFile(source, '// reviewed source must survive runtime saves\n');
    child = spawn(process.execPath, [path.join(temp, 'server.mjs')], {
      env: { ...process.env, GEMINI_API_KEY: '', PORT: String(port) }, stdio: 'ignore',
    });
    const base = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let i = 0; i < 100; i++) {
      try { ready = (await fetch(`${base}/healthz`)).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    assert.ok(ready, 'server did not start');
    assert.match(await (await fetch(base)).text(), /<html/i);
    const speechConfig = await (await fetch(base + '/api/speech/config')).json();
    assert.equal(speechConfig.provider, 'Gemini'); assert.equal(speechConfig.configured, false);
    const missingKey = await fetch(base + '/api/speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: 'Preview' }) });
    assert.equal(missingKey.status, 503); assert.deepEqual(await missingKey.json(), { error: 'speech-not-configured' });
    const questions = [{ id: 'server-test', question: 'Saved custom question' }];
    for (const endpoint of ['/api/custom-questions', '/api/save-drive-questions']) {
      const response = await fetch(base + endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questions }),
      });
      assert.equal(response.status, 200);
      assert.deepEqual(await (await fetch(base + '/api/custom-questions')).json(), { questions });
      assert.equal(await readFile(source, 'utf8'), '// reviewed source must survive runtime saves\n');
    }
    assert.deepEqual(JSON.parse(await readFile(path.join(temp, 'custom_questions.json'), 'utf8')), questions);
  } finally {
    if (child && child.exitCode === null && child.signalCode === null) {
      child.kill();
      await new Promise(resolve => child.once('exit', resolve));
    }
    await rm(temp, { recursive: true, force: true });
  }
});

test('Vite development serves the same Gemini configuration and missing-key routes', async () => {
  const probe = createServer();
  await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: process.cwd(), env: { ...process.env, GEMINI_API_KEY: '' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', data => { output = (output + data).slice(-3000); });
  child.stderr.on('data', data => { output = (output + data).slice(-3000); });
  try {
    const base = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let i = 0; i < 150; i++) {
      try {
        const response = await fetch(base + '/api/speech/config');
        if (response.ok) {
          const config = await response.json();
          assert.equal(config.provider, 'Gemini'); assert.equal(config.configured, false);
          ready = true; break;
        }
      } catch {}
      if (child.exitCode !== null) break;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    assert.ok(ready, output || 'Vite API did not start');
    const response = await fetch(base + '/api/speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: 'Preview' }) });
    assert.equal(response.status, 503); assert.deepEqual(await response.json(), { error: 'speech-not-configured' });
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = new Promise(resolve => child.once('exit', resolve)); child.kill(); await exited;
    }
  }
});
