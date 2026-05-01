import axios from 'axios'

export type PageContent = {
  id: number
  page_src: string
  title: string
  enc_title: string
}

const MEDIAWIKI: string = 'https://en.wikipedia.org/w/api.php'

const wikiClient = axios.create({
  headers: {
    'User-Agent': 'WikiRunnr/1.0 (Wikipedia speedrunning game; https://github.com/amazinglySK/WikiRunnr)',
  },
})

export const fetchWiki = async (link: string) => {
  const search_term = decodeURIComponent(link)
  const page_result = await wikiClient.get(MEDIAWIKI, {
    params: {
      action: 'parse',
      page: search_term,
      prop: 'displaytitle|text|sections',
      format: 'json',
      origin: '*',
    },
  })
  return page_result.data.parse
}

export const getRandomArticleTitles = async (n: number) => {
  try {
    const response = await wikiClient.get(MEDIAWIKI, {
      params: {
        action: 'query',
        list: 'random',
        rnnamespace: 0,
        rnlimit: n,
        format: 'json',
        origin: '*',
      },
    })
    const pages: PageContent[] = response.data.query.random.map((e: any) => {
      delete e.ns
      e.page_src = e.title.replace(/ /g, '_')
      e.enc_title = encodeURIComponent(e.page_src)
      return e
    })
    return pages
  } catch (error) {
    console.error(error)
  }
}

export const getTitleFromId = async (...id: number[]) => {
  try {
    const response = await wikiClient.get(MEDIAWIKI, {
      params: {
        action: 'query',
        prop: 'info',
        pageids: id.join('|'),
        format: 'json',
        origin: '*',
      },
    })

    const pages = id.map((single_id) => {
      const k = single_id.toString()
      const v = response.data.query.pages[k]
      delete v.ns
      let new_obj: PageContent = {
        id: parseInt(k),
        page_src: v.title.replace(/ /g, '_'),
        title: v.title,
        enc_title: '',
      }
      new_obj.enc_title = encodeURIComponent(new_obj.page_src)

      return new_obj
    })
    return pages
  } catch (error) {
    console.error(error)
  }
}
