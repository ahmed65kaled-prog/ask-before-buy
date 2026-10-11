export async function onRequestGet({ request }) {
  const incoming = new URL(request.url);
  const code = (incoming.searchParams.get('code') || incoming.searchParams.get('product_code') || '').replace(/\s+/g, '');
  if (!/^(\d{8}|\d{12,14})$/.test(code)) return Response.json({ok:false,error:'invalid_barcode'}, {status:400});
  const p = new URL('https://prices.openfoodfacts.org/api/v1/prices');
  p.searchParams.set('product_code', code); p.searchParams.set('order_by','-date'); p.searchParams.set('size','50');
  const r = await fetch(p, {headers:{'Accept':'application/json','User-Agent':'AskBeforeYouBuy/84 (production)'}});
  const body = await r.text();
  return new Response(body, {status:r.status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=180','access-control-allow-origin':'*'}});
}
