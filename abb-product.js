export async function onRequestGet({ request }) {
  const incoming = new URL(request.url);
  const code = (incoming.searchParams.get('code') || '').replace(/\s+/g, '');
  if (!/^(\d{8}|\d{12,14})$/.test(code)) return Response.json({ok:false,error:'invalid_barcode'}, {status:400});
  const url = new URL(`https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(code)}`);
  url.search = new URLSearchParams({product_type:'all',cc:'eg',lc:'ar',tags_lc:'ar',fields:'code,product_name,product_name_ar,product_name_en,brands,image_front_url,image_url,nutriscore_grade,nutrition_grades,categories_tags,last_modified_t'}).toString();
  const r = await fetch(url, {headers:{'Accept':'application/json','User-Agent':'AskBeforeYouBuy/84 (production)'}});
  const body = await r.text();
  return new Response(body, {status:r.status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=300','access-control-allow-origin':'*'}});
}
