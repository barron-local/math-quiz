export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url)
    const text = url.searchParams.get('text') || ''

    if (!text) {
      return new Response('Missing text', { status: 400 })
    }

    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=${encodeURIComponent(text)}`
    const audioRes = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://translate.google.com/',
      },
    })

    if (!audioRes.ok) {
      return new Response('TTS upstream error', { status: audioRes.status })
    }

    return new Response(audioRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(String(err), { status: 500 })
  }
}
