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

function versionTrackerPlugin(): Plugin {
  // Use build-time ISO string or timestamp
  const buildTime = new Date().toISOString()
  return {
    name: 'version-tracker',
    config() {
      return {
        define: {
          __APP_BUILD_TIME__: JSON.stringify(buildTime),
        },
      }
    },
    configureServer(server) {
      server.middlewares.use('/version.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
        res.end(JSON.stringify({ version: buildTime, timestamp: Date.now() }))
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: buildTime, timestamp: Date.now() }, null, 2),
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
    versionTrackerPlugin(),
  ],
})
