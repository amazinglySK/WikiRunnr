import axios from "axios";

const MEDIAWIKI = "https://en.wikipedia.org/w/api.php";
export default async function fetchWiki(link) {
  try {
    const search_term = link.split("\/").at(-1);
    const page_result = await axios.get(MEDIAWIKI, {
      params: {
        action: "parse",
        page: search_term,
        format: "json",
        origin: "*",
      },
    });
    return page_result.data.parse;
  } catch (err) {
    throw err;
  }
}
