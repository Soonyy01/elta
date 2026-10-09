// ELTA read-only relay over DexScreener's public API, Robinhood Chain only.
// Only the paths ELTA needs are allowed. Responses are cached 30 s at the edge
// so every visitor shares one upstream call and DexScreener's rate limits are respected.

const ADDR = '0x[a-fA-F0-9]{40}';
const PAIR = '0x[a-fA-F0-9]{40,64}';
const ALLOWED = [
  new RegExp(`^token-pairs/v1/robinhood/${ADDR}$`),
  new RegExp(`^tokens/v1/robinhood/${ADDR}(,${ADDR}){0,29}$`),
  new RegExp(`^latest/dex/pairs/robinhood/${PAIR}(,${PAIR}){0,29}$`),
  /^latest\/dex\/search\?q=[\w .$%-]{1,60}$/,
  /^token-boosts\/(top|latest)\/v1$/,
  /^token-profiles\/latest\/v1$/,
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Only GET is supported.' });
  }
  const p = String(req.query.p || '');
  if (!ALLOWED.some((re) => re.test(p))) {
    return res.status(400).json({ error: 'Path not allowed.' });
  }
  try {
    const upstream = await fetch(`https://api.dexscreener.com/${p}`, {
      headers: { accept: 'application/json', 'user-agent': 'ELTA/0.1 (LP radar for Robinhood Chain)' },
    });
    const body = await upstream.text();
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', upstream.ok ? 's-maxage=30, stale-while-revalidate=120' : 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(upstream.status).send(body);
  } catch (err) {
    return res.status(502).json({ error: 'DexScreener did not answer. Try again shortly.' });
  }
}
