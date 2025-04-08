// src/pages/api/resolve-map-url.js
export const GET = async ({ request }) => {
    const url = new URL(request.url);
    const mapUrl = url.searchParams.get('url');
    
    if (!mapUrl) {
      return new Response(JSON.stringify({ error: 'Missing URL parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    try {
      const res = await fetch(mapUrl, { redirect: 'manual' });
      const resolvedUrl = res.headers.get('location') || mapUrl;
      return new Response(JSON.stringify({ resolvedUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to resolve URL' }), {
        status: 500
      });
    }
  };