import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin } from 'vite'

function thaiTtsPlugin(): Plugin {
  return {
    name: 'thai-tts-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const url = new URL(req.url || '', `http://${req.headers.host || 'localhost:5173'}`)
          const text = url.searchParams.get('text') || ''
          if (!text) {
            res.statusCode = 400
            res.end('Missing text')
            return
          }

          const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=${encodeURIComponent(text)}`
          const audioRes = await fetch(googleUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              'Referer': 'https://translate.google.com/',
            },
          })

          if (!audioRes.ok) {
            res.statusCode = audioRes.status
            res.end()
            return
          }

          res.setHeader('Content-Type', 'audio/mpeg')
          res.setHeader('Cache-Control', 'public, max-age=86400')
          const arrayBuffer = await audioRes.arrayBuffer()
          res.end(Buffer.from(arrayBuffer))
        } catch (err) {
          res.statusCode = 500
          res.end(String(err))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    thaiTtsPlugin(),
  ],
})
