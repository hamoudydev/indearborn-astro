export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const shortUrl = url.searchParams.get('url');

  if (!shortUrl?.startsWith('https://maps.app.goo.gl/')) {
    return new Response(JSON.stringify({ 
      error: 'Invalid Google Maps short URL',
      provided: shortUrl 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Follow the redirect
    const res = await fetch(shortUrl, { redirect: 'manual' });
    const longUrl = res.headers.get('location');
    
    if (!longUrl) throw new Error('No redirect location found');

    // Extract coordinates (e.g., "!3d42.3221!4d-83.1763")
    const coordMatch = longUrl.match(/!3d([-\d.]+)!4d([-\d.]+)/);
    
    if (!coordMatch) throw new Error('No coordinates found');
    
    const [, lat, lng] = coordMatch;
    const isIOS = /iPad|iPhone|iPod/.test(request.headers.get('user-agent'));

    return new Response(JSON.stringify({
      url: isIOS 
        ? `https://maps.apple.com/?ll=${lat},${lng}` 
        : longUrl,
      coords: { lat, lng }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to resolve URL',
      fallback: shortUrl // Return original short URL
    }), { 
      status: 500 
    });
  }
}