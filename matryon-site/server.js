import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const PORT = process.env.PORT || 8080
const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url.split('?')[0]
  let filePath = path.join(DIST, file)

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(DIST, 'index.html'), (err2, data2) => {
        if (err2) { res.writeHead(502); res.end() }
        else { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(data2) }
      })
    } else {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' })
      res.end(data)
    }
  })
}).listen(PORT, () => console.log('listening on', PORT))
