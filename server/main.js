import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { fetchWiki, getRandomArticleTitles } from './fetchPage.js'

const PORT = 3000

const app = express()

app.get('/wiki{/*path}', async (req, res) => {
  try {
    const url = req.params.path[0]
    const page_result = await fetchWiki(url)
    let html_response = page_result.text['*']
    const injectedScript = `<script src = 'https://cdn.tailwindcss.com'></script>`
    const head = `
  <head>
    <style>
      a { color: blue !important; text-decoration: none; }
	  a:hover { text-decoration: underline !important }
	  a:visited { color : purple; }
    </style>
	<link rel="stylesheet" href="https://en.wikipedia.org/w/load.php?lang=en&modules=site.styles&only=styles">
  </head>
`
    html_response = `
	<!DOCTYPE html>
	<html>
		${head}
		<body>
			<h1>${page_result.title}</h1>
			${html_response}
		</body>
	</html>
`
    res.setHeader('Content-Type', 'text/html')
    res.send(html_response)
  } catch (e) {
    res.send(404)
  }
})

app.use(cors({ origin: '*' }))

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: { origin: '*' },
  cleanupEmptyChildNamespaces: true,
})

io.on('connection', (socket) => {
  console.log(socket.id + ' joined the io')

  socket.on('start', async () => {
    const titles = await getRandomArticleTitles(2)
    socket.emit('game-info', { start: titles[0], target: titles[1] })
  })

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected from the server')
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
