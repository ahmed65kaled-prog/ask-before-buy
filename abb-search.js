export async function onRequestGet({ request }) {
  const incoming = new URL(request.url);
  const q = (incoming.searchParams.get('q') || '').trim();
  if (q.length < 2 || q.length > 120) {
    return Response.json({ ok: false, error: 'invalid_query' }, { status: 400 });
  }
  const url = new URL('https://world.openfoodfacts.org/cgi/search.pl');
  url.search = new URLSearchParams({
    search_terms: q,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '8',
    lc: 'ar',
    cc: 'eg'
  }).toString();
  const r = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'AskBeforeYouBuy/84 (production)'
    }
  });
  const body = await r.text();
  return new Response(body, {
    status: r.status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=120',
      'access-control-allow-origin': '*'
    }
  });
}
