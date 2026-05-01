import type { RequestHandler } from './$types'
import { fetchWiki } from '$lib/fetchPage'

interface WikiSection {
  toclevel: number
  level: string
  line: string
  number: string
  index: string
  fromtitle: string
  byteoffset: number
  anchor: string
  linkAnchor: string
}

interface WikiPage {
  title: string
  text: { '*': string }
  sections: WikiSection[]
}

function buildTOCHTML(sections: WikiSection[]): string {
  const topLevel: (WikiSection & { children: WikiSection[] })[] = []

  for (const sec of sections) {
    if (sec.toclevel === 1) {
      topLevel.push({ ...sec, children: [] })
    } else if (sec.toclevel === 2 && topLevel.length > 0) {
      topLevel[topLevel.length - 1].children.push(sec)
    }
  }

  const renderItem = (item: WikiSection): string =>
    `<div class="toc-item"><a href="#${item.anchor}">${item.number}. ${item.line}</a></div>`

  const renderChildren = (children: WikiSection[]): string =>
    children
      .map(
        (child) =>
          `<div class="toc-subitem"><a href="#${child.anchor}">${child.number}. ${child.line}</a></div>`,
      )
      .join('\n')

  return `<div id="toc-sidebar"><h2>Contents</h2>
    ${topLevel
      .map(
        (item) =>
          `${renderItem(item)}\n${item.children.length > 0 ? renderChildren(item.children) : ''}`,
      )
      .join('\n')}
  </div>`
}

function sanitizeLinks(html: string): string {
  return (
    html
      // Rewrite absolute en.wikipedia.org links to the same-origin proxy
      .replace(
        /href="(?:https?:)?\/\/en\.wikipedia\.org\/wiki\/([^"]*?)"/gi,
        'href="/wiki/$1"',
      )
      // Kill all remaining protocol-relative or absolute external links
      .replace(/href="(?:https?:)?\/\/[^"]*"/gi, 'href="#" data-blocked')
      // Kill /w/ MediaWiki paths (edit, history, special pages, etc.)
      .replace(/href="\/w\/[^"]*"/gi, 'href="#" data-blocked')
      // Kill any remaining absolute https?:// links
      .replace(/href="https?:\/\/[^"]*"/gi, 'href="#" data-blocked')
  )
}

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params

  try {
    const page: WikiPage = await fetchWiki(slug)
    const pageContent = sanitizeLinks(page.text['*'])
    const tocHTML = buildTOCHTML(page.sections)

    const head = `
      <head>
        <style>
          body { display: flex; margin: 0; font-family: serif; }
          #toc-sidebar {
			font-family: sans-serif;
            min-width: 240px;
			max-width: 300px;
		    width: fit-content;
            padding: 1rem;
            border-right: 1px solid #ddd;
            background: #f9f9f9;
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto;
          }
          #toc-sidebar h2 {
            margin-top: 0;
          }
          .toc-item a, .toc-subitem a {
            display: block;
            padding: 4px 0;
            color: #0645ad;
            text-decoration: none;
            font-size: 0.95rem;
          }
          .toc-subitem {
            padding-left: 1rem;
          }
          .toc-item a:hover,
          .toc-subitem a:hover {
            text-decoration: underline;
          }
          .content {
            padding: 1rem;
            max-width: 900px;
          }
          a { color: blue !important; text-decoration: none; }
          a:hover { text-decoration: underline !important }
          a:visited { color : purple; }
        </style>
        <link rel="stylesheet" href="https://en.wikipedia.org/w/load.php?lang=en&modules=site.styles&only=styles">
      </head>
    `

    const html = `
      <!DOCTYPE html>
      <html>
        ${head}
        <body>
          ${tocHTML}
          <div class="content">
            <h1>${page.title}</h1>
            ${pageContent}
          </div>
        </body>
      </html>
    `

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    })
  } catch (err) {
    console.error('Error fetching page:', err)
    return new Response('Error fetching page', { status: 500 })
  }
}

