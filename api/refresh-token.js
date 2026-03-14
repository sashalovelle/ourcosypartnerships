// api/refresh-token.js
// Uses stored refresh token to get a new access token

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Get refresh token from Supabase
    const dbRes = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/gcal_tokens?select=refresh_token&limit=1`, {
      headers: {
        apikey: process.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });
    const rows = await dbRes.json();
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'No refresh token found' });

    const refreshToken = rows[0].refresh_token;

    // Exchange refresh token for new access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id:     process.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: process.env.VITE_GOOGLE_CLIENT_SECRET,
        grant_type:    'refresh_token',
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) return res.status(400).json({ error: tokens.error });

    return res.status(200).json({
      access_token: tokens.access_token,
      expires_in:   tokens.expires_in,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
