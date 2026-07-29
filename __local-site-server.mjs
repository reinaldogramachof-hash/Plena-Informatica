import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1')
  let pathname = url.pathname === '/servicos.html' ? '/servicos/servicos.html' : url.pathname

  try {
    pathname = decodeURIComponent(pathname)
  } catch {
    res.writeHead(400)
    res.end('Bad request')
    return
  }

  if (pathname.endsWith('/')) {
    pathname += 'index.html'
  }

  let file = path.normalize(path.join(root, pathname))
  if (!file.startsWith(root)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  try {
    const info = await stat(file)
    if (info.isDirectory()) {
      file = path.join(file, 'index.html')
    }

    const data = await readFile(file)
    res.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
    })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
}).listen(8080, '127.0.0.1', () => {
  console.log('Local site: http://127.0.0.1:8080/')
})
