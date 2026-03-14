// api/google-auth.js
// Exchanges Google auth code for access + refresh tokens

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code, redirect_uri } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     process.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: process.env.VITE_GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type:    'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) return res.status(400).json({ error: tokens.error });

    // Store refresh token in Supabase
    if (tokens.refresh_token) {
      await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/gcal_tokens?id=neq.00000000-0000-0000-0000-000000000000`, {
        method: 'DELETE',
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });
      await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/gcal_tokens`, {
        method: 'POST',
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify([{ refresh_token: tokens.refresh_token }]),
      });
    }

    return res.status(200).json({
      access_token:  tokens.access_token,
      expires_in:    tokens.expires_in,
      refresh_token: tokens.refresh_token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
