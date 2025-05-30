import axios from 'axios'

const MEDIAWIKI: string = 'https://en.wikipedia.org/w/api.php'

export const fetchWiki = async (link: string) => {
  const search_term = decodeURIComponent(link)
  const page_result = await axios.get(MEDIAWIKI, {
    params: {
      action: 'parse',
      page: search_term,
      prop: 'displaytitle|text',
      format: 'json',
      origin: '*',
    },
  })
  return page_result.data.parse
}

export const getRandomArticleTitles = async (n: number) => {
  try { 
    const response = await axios.get(MEDIAWIKI, {
      params: {
        action: 'query',
        list: 'random',
        rnnamespace: 0,
        rnlimit: n,
        format: 'json',
        origin: '*',
      },
    })
    const pages = response.data.query.random.map((e) => {
      delete e.ns
      e.page_src = e.title.replace(/ /g, '_')
      e.enc_title = encodeURIComponent(e.page_src)
      return e
    })
    return pages
  } catch (error) { 
    console.log("Oops, something went wrong")
    console.error(error)
  }
}
