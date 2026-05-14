const functions = require('firebase-functions');
const express = require('express');
const app = express();

app.use(express.json({ limit: '100mb' }));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  next();
});

function getApiKey(req) {
  if (req.body && req.body.apiKey) {
    return String(req.body.apiKey).trim();
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return String(process.env.ANTHROPIC_API_KEY).trim();
  }
  return null;
}

async function callAnthropic(apiKey, payload) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  if (!response.ok) {
    const err = text || `Anthropic returned ${response.status}`;
    throw new Error(err);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
}

app.post('/validate-claude', async (req, res) => {
  const apiKey = getApiKey(req);
  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  try {
    const payload = {
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Responde solo con: OK' }]
    };
    const result = await callAnthropic(apiKey, payload);
    return res.json({ ok: true, result });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
});

app.post('/claude-extract', async (req, res) => {
  const apiKey = getApiKey(req);
  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  const { systemPrompt, pdfBase64 } = req.body;
  if (!pdfBase64) {
    return res.status(400).json({ error: 'Missing pdfBase64' });
  }

  try {
    const payload = {
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64
            }
          },
          {
            type: 'text',
            text: systemPrompt
          }
        ]
      }]
    };
    const result = await callAnthropic(apiKey, payload);
    return res.json({ ok: true, result });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
});

exports.api = functions.https.onRequest(app);
